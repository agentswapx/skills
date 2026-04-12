# ATX Skills

Reusable agent skills for ATX on BSC. This repository is built for agents that
need safe, scriptable workflows for wallet setup, price queries, ATX/USDT swaps,
PancakeSwap V3 liquidity management, and token transfers.

[**中文文档**](./README.zh.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk
- **SDK Docs**: [agentswapx/atx-agent-sdk](https://github.com/agentswapx/atx-agent-sdk)

---

## Why This Repository Exists

This repo packages ATX-specific operational knowledge into reusable skills so an
agent can:

- create or import the wallet used by the skill
- query ATX price, balances, LP positions, and ERC20 token info
- buy or sell ATX against USDT on PancakeSwap V3
- add liquidity, remove liquidity, collect fees, and burn empty LP NFTs
- transfer BNB, ATX, USDT, or arbitrary ERC20 tokens

It is a good fit for agent directories such as [skills.sh](https://skills.sh/),
where users want a discoverable skill with a clear install path, explicit
safety rules, and copy-pasteable commands.

---

## Quick Start

1. **Node.js 18+**
2. Clone the skill repo:

```bash
git clone https://github.com/agentswapx/skills.git
cd skills
```

3. Install dependencies:

```bash
npm install
```

This repository installs `atx-agent-sdk` directly from GitHub, so you do not
need a side-by-side SDK clone for normal usage.

4. Optionally set a BSC RPC endpoint:

```bash
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"  # Optional, has default
```

5. Run commands from the repository root:

```bash
node atx-trading/scripts/query.js price
node atx-trading/scripts/wallet.js list
```

> **One wallet only**: this skill allows only one wallet per installation. If a wallet already exists, `create` and `import` fail.
>
> **Password flow**: `wallet create` and `wallet import` save the password to secure storage, so later write operations usually auto-unlock.
>
> **Keystore path**: The ATX skill always uses `~/.config/atx-agent/keystore`.

---

## Example Tasks

### Read-only queries

```bash
node atx-trading/scripts/wallet.js list
node atx-trading/scripts/query.js price
node atx-trading/scripts/query.js balance <address>
node atx-trading/scripts/query.js quote <buy|sell> <amount>
node atx-trading/scripts/query.js positions <address>
node atx-trading/scripts/query.js token-info <tokenAddress>
```

### Write operations

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

## Security Rules

1. **Never** output private keys or passwords in chat.
2. **Always** preview price, quote, balance, or positions before executing writes.
3. **Always** wait for explicit user confirmation before swap, transfer, or liquidity writes.
4. **Never** execute large trades without explicit user confirmation.
5. `wallet export` is for internal handling only and its output must never be shown to the user.

## Repository Structure

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

## Agent Workflow

For swaps, transfers, and liquidity operations:

1. Query the current price, quote, balance, or positions.
2. Summarize the preview for the user.
3. Wait for explicit confirmation.
4. Execute the write command.
5. Report the transaction hash and result.
