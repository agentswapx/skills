# ATX Skills

本目录包含可由 AI Agent 调用的技能（Skills），用于在 BSC 链上与 ATX 代币进行交互。

[**English**](./README.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk
- **SDK 文档**: [agentswapx/atx-agent-sdk](https://github.com/agentswapx/atx-agent-sdk)

---

## 目录结构

```
skills/
└── atx-trading/           ← ATX 交易技能
    ├── SKILL.md            ← 技能描述（供 Agent 框架识别）
    └── scripts/            ← 可执行脚本
        ├── _helpers.js     ← 公共工具（创建 client、解析参数、格式化）
        ├── wallet.js       ← 钱包管理
        ├── query.js        ← 只读查询
        ├── swap.js         ← 代币交换
        ├── liquidity.js    ← V3 流动性管理
        └── transfer.js     ← 转账
```

---

## 前置条件

1. **Node.js 18+**
2. 将两个仓库并排克隆到同一级目录：

```bash
git clone https://github.com/agentswapx/skills.git
git clone https://github.com/agentswapx/atx-agent-sdk.git
```

3. 从源码构建 SDK：

```bash
cd atx-agent-sdk
npm install
npm run build
```

4. 回到 `skills` 仓库并安装本地 SDK：

```bash
cd ../skills
npm install ../atx-agent-sdk
```

5. 设置环境变量：

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"  # 可选，有默认值
```

> **密码流程**：执行 `wallet create` 或 `wallet import` 时，会在终端里交互式提示输入密码。密码保存成功后会自动写入安全存储（macOS Keychain / Linux Secret Service / master key file），后续操作通常不需要再次输入。
>
> **keystore 目录**：ATX 技能固定使用 `~/.config/atx-agent/keystore`。

---

## atx-trading — ATX 交易技能

### 使用方式

所有脚本从**项目根目录**执行：

```bash
node skills/atx-trading/scripts/<script>.js <subcommand> [args]
```

### 钱包管理 (wallet.js)

```bash
# 创建新钱包（通过 --password 传入密码，或在终端交互输入）
node skills/atx-trading/scripts/wallet.js create [name] --password <pwd>

# 列出所有钱包及余额
node skills/atx-trading/scripts/wallet.js list

# 导入已有私钥
node skills/atx-trading/scripts/wallet.js import <privateKey> [name] --password <pwd>

# 导出私钥（仅程序内部使用，禁止展示给用户）
node skills/atx-trading/scripts/wallet.js export <address>

# 检查是否已保存密码
node skills/atx-trading/scripts/wallet.js has-password <address>

# 删除已保存的密码
node skills/atx-trading/scripts/wallet.js forget-password <address>
```

所有脚本输出 JSON 格式。创建钱包时密码自动保存，后续操作从安全存储自动解锁。

### 只读查询 (query.js)

```bash
# 查询 ATX/USDT 当前价格
node skills/atx-trading/scripts/query.js price

# 查询地址余额（BNB / ATX / USDT）
node skills/atx-trading/scripts/query.js balance <address>

# 交换报价预览
node skills/atx-trading/scripts/query.js quote <buy|sell> <amount>

# 查询地址的 LP 仓位
node skills/atx-trading/scripts/query.js positions <address>

# 查询任意 ERC20 代币信息
node skills/atx-trading/scripts/query.js token-info <tokenAddress>
```

### 代币交换 (swap.js)

```bash
# 用 USDT 买入 ATX
node skills/atx-trading/scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps]

# 卖出 ATX 换 USDT
node skills/atx-trading/scripts/swap.js sell <atxAmount> [--from address] [--slippage bps]
```

- `--slippage` 单位为 bps（基点），默认 300（3%）
- `--from` 指定发送钱包地址，省略则使用 keystore 中的第一个钱包

### V3 流动性管理 (liquidity.js)

```bash
# 添加全范围流动性
node skills/atx-trading/scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address]

# 按百分比移除流动性
node skills/atx-trading/scripts/liquidity.js remove <tokenId> <percent> [--from address]

# 收取累积手续费
node skills/atx-trading/scripts/liquidity.js collect <tokenId> [--from address]

# 销毁已清空的仓位 NFT
node skills/atx-trading/scripts/liquidity.js burn <tokenId> [--from address]
```

### 转账 (transfer.js)

```bash
# 发送 BNB
node skills/atx-trading/scripts/transfer.js bnb <to> <amount> [--from address]

# 发送 ATX
node skills/atx-trading/scripts/transfer.js atx <to> <amount> [--from address]

# 发送 USDT
node skills/atx-trading/scripts/transfer.js usdt <to> <amount> [--from address]

# 发送任意 ERC20
node skills/atx-trading/scripts/transfer.js token <tokenAddress> <to> <amount> [--from address]
```

---

## 安全规则

1. **禁止**在对话中输出私钥或密码
2. 执行交易或转账前**必须**先查询余额和报价，展示给用户并等待确认
3. **禁止**在没有用户明确确认的情况下执行大额交易
4. 私钥以 keystore V3 加密格式存储，不存在明文私钥

## 操作流程

对于任何写操作（交换、流动性、转账），建议遵循以下流程：

1. 用 `query.js` 查询当前价格和余额
2. 将信息展示给用户
3. 等待用户明确确认
4. 执行操作
5. 报告交易哈希和结果
