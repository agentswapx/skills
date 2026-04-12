# ATX Skills

面向 ATX 与 BSC 的可复用 Agent Skills。这个仓库提供可脚本化的
钱包管理、价格查询、ATX/USDT 交易、PancakeSwap V3 流动性操作和
代币转账能力，方便 agent 直接复用。

[**English**](./README.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk
- **SDK 文档**: [agentswapx/atx-agent-sdk](https://github.com/agentswapx/atx-agent-sdk)

---

## 这个仓库解决什么问题

这个仓库把 ATX 相关流程打包成可安装、可发现、可复用的 skill，适合：

- 创建或导入 skill 使用的钱包
- 查询 ATX 价格、余额、LP 仓位和 ERC20 代币信息
- 在 PancakeSwap V3 上买卖 ATX/USDT
- 添加流动性、减仓、收手续费、销毁空仓位 NFT
- 转账 BNB、ATX、USDT 或任意 ERC20

它很适合发布到 [skills.sh](https://skills.sh/) 这类目录站，因为安装路径、
安全规则和使用命令都很清晰。

---

## 快速开始

1. **Node.js 18+**
2. 克隆 `skills` 仓库：

```bash
git clone https://github.com/agentswapx/skills.git
cd skills
```

3. 安装依赖：

```bash
npm install
```

本仓库会直接从 GitHub 安装 `atx-agent-sdk`，正常使用时不需要再并排克隆 SDK 仓库。

4. 可选设置 BSC RPC：

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"  # 可选，有默认值
```

5. 从仓库根目录执行命令：

```bash
node atx-trading/scripts/query.js price
node atx-trading/scripts/wallet.js list
```

> **单钱包限制**：当前 skill 每次安装只允许一个钱包，已存在钱包时 `create` 和 `import` 会失败。
>
> **密码流程**：执行 `wallet create` 或 `wallet import` 时保存密码到安全存储，后续写操作通常可自动解锁。
>
> **keystore 目录**：ATX 技能固定使用 `~/.config/atx-agent/keystore`。

---

## 典型任务

### 只读查询

```bash
node atx-trading/scripts/wallet.js list
node atx-trading/scripts/query.js price
node atx-trading/scripts/query.js balance <address>
node atx-trading/scripts/query.js quote <buy|sell> <amount>
node atx-trading/scripts/query.js positions <address>
node atx-trading/scripts/query.js token-info <tokenAddress>
```

### 写操作

```bash
node atx-trading/scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps]
node atx-trading/scripts/swap.js sell <atxAmount> [--from address] [--slippage bps]
node atx-trading/scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address]
node atx-trading/scripts/liquidity.js remove <tokenId> <percent> [--from address]
node atx-trading/scripts/liquidity.js collect <tokenId> [--from address]
node atx-trading/scripts/liquidity.js burn <tokenId> [--from address]
node atx-trading/scripts/transfer.js bnb <to> <amount> [--from address]
node atx-trading/scripts/transfer.js atx <to> <amount> [--from address]
node atx-trading/scripts/transfer.js usdt <to> <amount> [--from address]
node atx-trading/scripts/transfer.js token <tokenAddress> <to> <amount> [--from address]
```

---

## 安全规则

1. **禁止**在对话中输出私钥或密码。
2. 执行写操作前，**必须**先预览价格、报价、余额或仓位。
3. 交换、转账、流动性写操作前，**必须**等待用户明确确认。
4. **禁止**在没有明确确认的情况下执行大额交易。
5. `wallet export` 仅供内部处理，输出结果绝不能展示给用户。

## 仓库结构

```text
atx-trading/
├── SKILL.md
└── scripts/
    ├── _helpers.js
    ├── wallet.js
    ├── query.js
    ├── swap.js
    ├── liquidity.js
    └── transfer.js
```

## Agent 操作流程

对于交换、转账、流动性等写操作，建议统一按以下流程执行：

1. 先查询当前价格、报价、余额或仓位。
2. 把预览信息展示给用户。
3. 等待用户明确确认。
4. 再执行写操作。
5. 返回交易哈希和结果。
