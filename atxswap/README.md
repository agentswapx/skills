# ATXSwap Skill

A skill bundle for the ATXSwap decentralized agent exchange protocol on BSC. A single `SKILL.md`
works across clients represented by **Claude Code** and **OpenClaw**, so you do
not need separate directories for different clients.

[**中文文档**](./README.zh.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK on npm**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **SDK source / docs**: [agentswapx/atxswap-sdk](https://github.com/agentswapx/atxswap-sdk)

For project background and a short [team introduction](https://docs.atxswap.com/guide/team) ([中文](https://docs.atxswap.com/zh/guide/team)), see the ATXSwap documentation site. This README describes the skill’s scope and scripts.

## What This Skill Covers

- Create the single wallet used by the skill (importing an existing private key is not supported)
- Query ATX price, balances, LP positions, and ERC20 token info
- Buy or sell ATX against USDT on PancakeSwap V3
- Add liquidity, remove liquidity, collect fees, and burn empty LP NFTs
- Transfer BNB, ATX, USDT, or arbitrary ERC20 tokens

## Directory Layout

```text
atxswap/
├── SKILL.md
├── README.md
├── README.zh.md
├── PUBLISH.md
├── CHANGELOG.md
├── .clawhubignore
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

## Install

### OpenClaw Install

```bash
openclaw skills install atxswap
```

### Claude Code Install

```bash
git clone https://github.com/agentswapx/skills.git
cd skills/atxswap && npm install
```

By default the skill uses a built-in fallback list of 6 BSC public RPC
endpoints. To override, set `BSC_RPC_URL` to a single URL or to a
comma-separated list (priority left to right):

```bash
export BSC_RPC_URL="https://my-private-rpc.example.com,https://bsc-dataseed.bnbchain.org"
```

## Common Commands

```bash
cd skills/atxswap && node scripts/wallet.js list
cd skills/atxswap && node scripts/query.js price
cd skills/atxswap && node scripts/query.js quote buy 1
```

When invoked through a `${SKILL_DIR}`-aware runtime, `cd "${SKILL_DIR}"` is
preferred so the skill works regardless of where the client installed it.

## Security Rules

1. Never expose private keys or passwords in chat output.
2. Always preview price, quote, balance, or positions before write actions.
3. Always wait for explicit user confirmation before swap, transfer, or liquidity writes.
4. Treat all write actions as mainnet asset operations.
