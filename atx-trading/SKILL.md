---
name: atx-trading
description: >-
  Trade ATX tokens on BSC via PancakeSwap V3. Manage wallets (create/import/list),
  query prices and balances, swap ATX/USDT, manage V3 liquidity positions, and
  transfer BNB/ERC20 tokens. Use when the user mentions ATX trading, buying,
  selling, wallet creation, token transfer, liquidity, or price queries.
compatibility: Requires Node.js 18+ and npm. Network access to BSC RPC required.
metadata:
  author: agentswapx
  version: "1.0"
---

# ATX Trading Skill

Interact with ATX token on BSC via `atx-agent-sdk`. All scripts live in
`skills/atx-trading/scripts/` and use the SDK from `packages/atx-agent-sdk/`.

- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk

## Prerequisites

Clone and build the SDK before running scripts:

```bash
git clone https://github.com/agentswapx/atx-agent-sdk.git
cd atx-agent-sdk
npm install
npm run build
```

## Environment Variables

Scripts read from environment variables:

- `WALLET_PASSWORD` — password for keystore encrypt/decrypt (required only for first create/import; auto-saved afterwards)
- `KEYSTORE_PATH` — keystore directory (default: `./keystore`)
- `BSC_RPC_URL` — custom RPC (default: `https://bsc-rpc.publicnode.com`)
- `ATX_SECRET_STORE` — force secret store backend: `keychain` / `secret-service` / `file` (auto-detected by default)
- `ATX_MASTER_KEY_PATH` — master key file path (default: `~/.config/atx-agent/master.key`)
- `ATX_SECRET_STORE_PATH` — encrypted secrets file path (default: `~/.config/atx-agent/secrets.json`)

## Security Rules

1. **Never** output private keys or passwords in chat
2. **Always** show a preview (quote/balance) before executing trades or transfers, and ask the user to confirm
3. **Never** execute large trades without explicit user confirmation
4. All private keys are stored encrypted in keystore files — never as plaintext

## Available Scripts

Run all scripts from the project root with: `node skills/atx-trading/scripts/<script>.js <subcommand> [args]`

### wallet.js — Wallet Management

```bash
# Create a new wallet (password auto-saved)
node skills/atx-trading/scripts/wallet.js create [name]

# List all wallets with balances
node skills/atx-trading/scripts/wallet.js list

# Import existing private key (password auto-saved)
node skills/atx-trading/scripts/wallet.js import <privateKey> [name]

# Export private key (NEVER show to user; auto-loads saved password)
node skills/atx-trading/scripts/wallet.js export <address>

# Check if password is saved
node skills/atx-trading/scripts/wallet.js has-password <address>

# Remove saved password
node skills/atx-trading/scripts/wallet.js forget-password <address>
```

### query.js — Read-Only Queries

```bash
# Current ATX/USDT price
node skills/atx-trading/scripts/query.js price

# Balance of an address
node skills/atx-trading/scripts/query.js balance <address>

# Swap quote (preview only)
node skills/atx-trading/scripts/query.js quote <buy|sell> <amount>

# List LP positions for an address
node skills/atx-trading/scripts/query.js positions <address>

# ERC20 token info
node skills/atx-trading/scripts/query.js token-info <tokenAddress>
```

### swap.js — Buy/Sell ATX

```bash
# Buy ATX with USDT
node skills/atx-trading/scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps]

# Sell ATX for USDT
node skills/atx-trading/scripts/swap.js sell <atxAmount> [--from address] [--slippage bps]
```

### liquidity.js — V3 Liquidity Management

```bash
# Add full-range liquidity
node skills/atx-trading/scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address]

# Remove liquidity by percentage
node skills/atx-trading/scripts/liquidity.js remove <tokenId> <percent> [--from address]

# Collect earned fees
node skills/atx-trading/scripts/liquidity.js collect <tokenId> [--from address]

# Burn an empty position NFT
node skills/atx-trading/scripts/liquidity.js burn <tokenId> [--from address]
```

### transfer.js — Send Tokens

```bash
# Send BNB
node skills/atx-trading/scripts/transfer.js bnb <to> <amount> [--from address]

# Send ATX
node skills/atx-trading/scripts/transfer.js atx <to> <amount> [--from address]

# Send USDT
node skills/atx-trading/scripts/transfer.js usdt <to> <amount> [--from address]

# Send any ERC20
node skills/atx-trading/scripts/transfer.js token <tokenAddress> <to> <amount> [--from address]
```

## Workflow: Before Any Write Operation

1. Run `query.js` to check price and balance
2. Present the information to the user
3. Wait for explicit confirmation
4. Execute the operation
5. Report the transaction hash and result
