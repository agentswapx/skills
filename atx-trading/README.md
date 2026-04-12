# ATX Trading Skill

This directory contains the standalone `skills.sh` variant of the ATX trading
skill. It is separate from `skills/atx-trading-openclaw`, which is maintained
for OpenClaw and ClawHub publishing.

[**中文文档**](./README.zh.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk
- **SDK Docs**: [agentswapx/atx-agent-sdk](https://github.com/agentswapx/atx-agent-sdk)

## What This Skill Covers

- Create or import the single wallet used by the skill
- Query ATX price, balances, LP positions, and ERC20 token info
- Buy or sell ATX against USDT on PancakeSwap V3
- Add liquidity, remove liquidity, collect fees, and burn empty LP NFTs
- Transfer BNB, ATX, USDT, or arbitrary ERC20 tokens

## Directory Layout

```text
atx-trading/
├── SKILL.md
├── README.md
├── README.zh.md
├── package.json
└── scripts/
    ├── _helpers.js
    ├── wallet.js
    ├── query.js
    ├── swap.js
    ├── liquidity.js
    └── transfer.js
```

## Quick Start

```bash
cd skills/atx-trading
npm install
```

Optional RPC override:

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"
```

Common commands:

```bash
cd skills/atx-trading && node scripts/wallet.js list
cd skills/atx-trading && node scripts/query.js price
cd skills/atx-trading && node scripts/query.js quote buy 1
```

## Security Rules

1. Never expose private keys or passwords in chat output.
2. Always preview price, quote, balance, or positions before write actions.
3. Always wait for explicit user confirmation before swap, transfer, or liquidity writes.
4. Treat all write actions as mainnet asset operations.

## Skills.sh Positioning

This directory is the packaged `skills.sh` version. Keep operational docs and
package metadata here instead of under `skills/` root so it remains installable
and understandable on its own.
