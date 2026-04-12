# ATX Trading OpenClaw 技能

这个目录是面向 OpenClaw 与 ClawHub 的 ATX 交易技能版本。它和
`skills/atx-trading` 分开维护，后者继续保留给 `skills.sh` 使用。

[**English**](./README.md)

## 能力范围

- 创建或导入当前技能实例使用的单个钱包
- 查询 ATX 价格、余额、报价、LP 仓位和 ERC20 代币信息
- 在 PancakeSwap V3 上买卖 ATX/USDT
- 添加流动性、减仓、收手续费、销毁空仓位 NFT
- 转账 BNB、ATX、USDT 或任意 ERC20 代币

## 目录结构

```text
atx-trading-openclaw/
├── SKILL.md
├── README.md
├── README.zh.md
├── PUBLISH.md
├── package.json
└── scripts/
    ├── _helpers.js
    ├── wallet.js
    ├── query.js
    ├── swap.js
    ├── liquidity.js
    └── transfer.js
```

## 本地初始化

首次使用前，先在当前目录安装依赖：

```bash
cd skills/atx-trading-openclaw
npm install
```

可选设置 BSC RPC：

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"
```

## 常用命令

```bash
cd skills/atx-trading-openclaw && node scripts/wallet.js list
cd skills/atx-trading-openclaw && node scripts/query.js price
cd skills/atx-trading-openclaw && node scripts/query.js quote buy 1
```

## 安全模型

1. 不要在聊天输出中暴露私钥或密码。
2. 所有写操作前，必须先预览价格、报价、余额或仓位。
3. 交换、转账、流动性操作前，必须等待用户明确确认。
4. 所有写操作都按主网真实资产处理。

## 运行时说明

`node scripts/query.js quote ...` 依赖实时的 PancakeSwap Quoter 链路。
如果 Quoter 模拟调用回退，脚本现在会返回简洁的 JSON 错误，而不是原始堆栈。
出现这种情况时应停止继续写操作，并把错误反馈给用户。

## OpenClaw 说明

- ClawHub 发布的是一个技能目录，主入口是 `SKILL.md`。
- 这个目录按可独立发布到 ClawHub 的方式组织。
- 具体验证和发布命令见 `PUBLISH.md`。
