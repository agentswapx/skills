---
name: atx-trading
description: >-
  Manage ATX on BSC with wallet creation, price and balance queries, PancakeSwap
  V3 swaps, liquidity operations, and BNB/ERC20 transfers. Use when the user
  mentions ATX, BSC, PancakeSwap V3, wallet creation, price checks, buying,
  selling, liquidity, fees, or token transfers.
compatibility: Requires Node.js 18+ and npm. Network access to BSC RPC required.
inject:
  - bash: echo "${CLAUDE_SKILL_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
    as: SKILL_DIR
metadata:
  author: agentswapx
  version: "2.1"
---

# ATX Trading Skill

Execute ATX trading and wallet workflows on BSC. This skill is designed for
agents that need safe, repeatable commands for wallet management, ATX/USDT
quotes, swaps, V3 liquidity actions, and transfers.

- **SDK**: https://github.com/agentswapx/atx-agent-sdk
- **Keystore dir**: `~/.config/atx-agent/keystore` (fixed, not configurable)
- **Secrets dir**: `~/.config/atx-agent/` (master.key + secrets.json)

## Use This Skill For

- Create or import the single wallet used by this skill instance
- Query ATX price, balances, LP positions, and arbitrary ERC20 token info
- Buy or sell ATX against USDT on PancakeSwap V3
- Add liquidity, remove liquidity, collect fees, or burn empty LP NFTs
- Transfer BNB, ATX, USDT, or arbitrary ERC20 tokens

## Script Location

Use the skill directory path to locate scripts. If `${SKILL_DIR}` is
available use it; otherwise use the absolute path to this skill's directory
(for example, the directory where this skill was installed for the current agent).

If you are using this repository directly, treat `skills/atx-trading/` as the
standalone package root and run `npm install` there before using any script.

Example:

```bash
cd skills/atx-trading && npm install
cd "${SKILL_DIR}" && node scripts/wallet.js list
```

All examples below use `cd "${SKILL_DIR}" &&` for clarity.

## Operational Constraints

- Only **one wallet** is allowed per skill installation. If a wallet already
  exists, `create` and `import` fail.
- Use `wallet list` before creating or importing a wallet.
- Scripts write JSON output unless the underlying command intentionally returns
  plain text, such as `wallet export`.

## Password Rules

When the user asks to **create** or **import** a wallet:

1. Ask the user for a password first (do NOT generate one)
2. Pass it via `--password <pwd>` to the script
3. The password is auto-saved to secure storage after creation
4. Later operations (swap, transfer, etc.) auto-unlock — no password needed

For **swap**, **transfer**, and **liquidity** operations, rely on auto-unlock
first. Only ask for the password if auto-unlock fails.

## Security Rules

1. **NEVER** output private keys or passwords in chat
2. **ALWAYS** run a preview before write actions: query price, quote, or balance as appropriate
3. **ALWAYS** show the preview to the user and wait for explicit confirmation before swap, transfer, or liquidity writes
4. **NEVER** execute large trades without the user saying "yes" or "confirm"
5. The `export` command output must NEVER be shown to the user
6. Treat all BSC writes as real-asset operations

## High-Value Workflows

### Check market state

```bash
cd "${SKILL_DIR}" && node scripts/query.js price
cd "${SKILL_DIR}" && node scripts/query.js balance <address>
cd "${SKILL_DIR}" && node scripts/query.js positions <address>
```

### Preview before swap

```bash
cd "${SKILL_DIR}" && node scripts/query.js quote <buy|sell> <amount>
```

### Execute after confirmation

```bash
cd "${SKILL_DIR}" && node scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/transfer.js atx <to> <amount> [--from address] [--password <pwd>]
```

## Command Reference

### `wallet.js`

```bash
cd "${SKILL_DIR}" && node scripts/wallet.js create [name] --password <pwd>
cd "${SKILL_DIR}" && node scripts/wallet.js list
cd "${SKILL_DIR}" && node scripts/wallet.js import <privateKey> [name] --password <pwd>
cd "${SKILL_DIR}" && node scripts/wallet.js export <address>
cd "${SKILL_DIR}" && node scripts/wallet.js has-password <address>
cd "${SKILL_DIR}" && node scripts/wallet.js forget-password <address>
```

### `query.js`

```bash
cd "${SKILL_DIR}" && node scripts/query.js price
cd "${SKILL_DIR}" && node scripts/query.js balance <address>
cd "${SKILL_DIR}" && node scripts/query.js quote <buy|sell> <amount>
cd "${SKILL_DIR}" && node scripts/query.js positions <address>
cd "${SKILL_DIR}" && node scripts/query.js token-info <tokenAddress>
```

### `swap.js`

```bash
cd "${SKILL_DIR}" && node scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/swap.js sell <atxAmount> [--from address] [--slippage bps] [--password <pwd>]
```

### `liquidity.js`

```bash
cd "${SKILL_DIR}" && node scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/liquidity.js remove <tokenId> <percent> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/liquidity.js collect <tokenId> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/liquidity.js burn <tokenId> [--from address] [--password <pwd>]
```

### `transfer.js`

```bash
cd "${SKILL_DIR}" && node scripts/transfer.js bnb <to> <amount> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/transfer.js atx <to> <amount> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/transfer.js usdt <to> <amount> [--from address] [--password <pwd>]
cd "${SKILL_DIR}" && node scripts/transfer.js token <tokenAddress> <to> <amount> [--from address] [--password <pwd>]
```

## Standard Workflow

For any write action:

1. Query current price, quote, balance, or positions as needed
2. Summarize the preview for the user
3. Wait for explicit confirmation
4. Execute the write command
5. Report the transaction hash and result

## Variant Boundary

This directory is the `skills.sh` variant of the ATX trading skill. Keep it
separate from `skills/atx-trading-openclaw`, which is the OpenClaw and
ClawHub-oriented package.
