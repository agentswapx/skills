# ATX Trading 技能

这个目录是面向 `skills.sh` 的独立 ATX 交易技能版本。它和
`skills/atx-trading-openclaw` 分开维护，后者用于 OpenClaw 与 ClawHub。

[**English**](./README.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk
- **SDK 文档**: [agentswapx/atx-agent-sdk](https://github.com/agentswapx/atx-agent-sdk)

## 能力范围

- 创建或导入当前技能实例使用的单个钱包
- 查询 ATX 价格、余额、LP 仓位和 ERC20 代币信息
- 在 PancakeSwap V3 上买卖 ATX/USDT
- 添加流动性、减仓、收手续费、销毁空仓位 NFT
- 转账 BNB、ATX、USDT 或任意 ERC20 代币

## 目录结构

```text
atx-trading/
├── SKILL.md
├── README.md
├── README.zh.md
├── .gitignore
├── package.json
└── scripts/
    ├── _helpers.js
    ├── wallet.js
    ├── query.js
    ├── swap.js
    ├── liquidity.js
    └── transfer.js
```

## 快速开始

```bash
cd skills/atx-trading
npm install
```

可选设置 BSC RPC：

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"
```

常用命令：

```bash
cd skills/atx-trading && node scripts/wallet.js list
cd skills/atx-trading && node scripts/query.js price
cd skills/atx-trading && node scripts/query.js quote buy 1
```

## 安全规则

1. 不要在聊天输出中暴露私钥或密码。
2. 所有写操作前，必须先预览价格、报价、余额或仓位。
3. 交换、转账、流动性操作前，必须等待用户明确确认。
4. 所有写操作都按主网真实资产处理。

## Skills.sh 定位

这个目录是打包后的 `skills.sh` 版本，因此包描述、README 和操作说明都应放在
当前目录下，而不是继续挂在 `skills/` 根目录。
