# ATX Trading OpenClaw Skill

This directory contains the OpenClaw and ClawHub variant of the ATX trading
skill. It is separate from `skills/atxswap`, which remains the
`skills.sh`-oriented version.

[**中文文档**](./README.zh.md)

## What It Does

- Create or import the single wallet used by this skill installation
- Query ATX price, balances, quotes, LP positions, and ERC20 token info
- Buy or sell ATX against USDT on PancakeSwap V3
- Add liquidity, remove liquidity, collect fees, and burn empty LP NFTs
- Transfer BNB, ATX, USDT, or arbitrary ERC20 tokens

## Directory Layout

```text
atxswap-openclaw/
├── SKILL.md
├── README.md
├── README.zh.md
├── PUBLISH.md
├── CHANGELOG.md
├── .gitignore
├── .clawhubignore
├── package.json
└── scripts/
    ├── _helpers.js
    ├── wallet.js
    ├── query.js
    ├── swap.js
    ├── liquidity.js
    └── transfer.js
```

## Local Bootstrap

Install dependencies inside this directory before first use:

```bash
cd skills/atxswap-openclaw
npm install
```

Optional RPC override:

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"
```

## Common Commands

```bash
cd skills/atxswap-openclaw && node scripts/wallet.js list
cd skills/atxswap-openclaw && node scripts/query.js price
cd skills/atxswap-openclaw && node scripts/query.js quote buy 1
```

## Security Model

1. Never expose private keys or passwords in chat output.
2. Always preview price, quote, balance, or positions before write actions.
3. Always wait for explicit confirmation before swap, transfer, or liquidity writes.
4. Treat all write actions as mainnet asset operations.

## Known Runtime Note

`node scripts/query.js quote ...` depends on the live PancakeSwap Quoter path.
If the Quoter simulation reverts, the script now returns a compact JSON error
instead of a raw stack trace. In that case, stop and report the error instead of
guessing a trade preview.

## OpenClaw Notes

- ClawHub publishes a skill folder whose main entry point is `SKILL.md`.
- This directory is designed to be self-contained for ClawHub publishing.
- Use `PUBLISH.md` for validate and publish commands.
