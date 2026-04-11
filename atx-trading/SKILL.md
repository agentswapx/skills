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
  version: "2.0"
---

# ATX Trading Skill

Trade ATX tokens on BSC. All scripts output JSON for easy parsing.

- **SDK**: https://github.com/agentswapx/atx-agent-sdk
- **Keystore dir**: `~/.config/atx-agent/keystore` (fixed, not configurable)
- **Secrets dir**: `~/.config/atx-agent/` (master.key + secrets.json)

## Important: One Wallet Only

This skill only allows **one wallet** per installation. If a wallet already
exists, `create` and `import` will fail with an error. Use `wallet list` to
check if a wallet already exists before attempting to create one.

## Important: Password Handling

When the user asks to **create or import a wallet**, you MUST:

1. Ask the user for a password first (do NOT generate one)
2. Pass it via `--password <pwd>` to the script
3. The password is auto-saved to secure storage after creation
4. Later operations (swap, transfer, etc.) auto-unlock — no password needed

When the user asks to **swap, transfer, or manage liquidity** and the wallet
was already created, the password is auto-loaded from secure storage.
Only if auto-unlock fails, ask the user for their password and pass `--password`.

## Security Rules

1. **NEVER** output private keys or passwords in chat
2. **ALWAYS** run a preview (query price + balance) before executing trades, show the user, and wait for explicit confirmation
3. **NEVER** execute large trades without the user saying "yes" or "confirm"
4. The `export` command output must NEVER be shown to the user

## Scripts

All commands use `$CLAUDE_SKILL_DIR` to locate scripts:

### wallet.js

```bash
# Create wallet — ask user for password first, then pass via --password
node "$CLAUDE_SKILL_DIR/scripts/wallet.js" create [name] --password <pwd>

# List all wallets (no password needed)
node "$CLAUDE_SKILL_DIR/scripts/wallet.js" list

# Import private key — ask user for password first
node "$CLAUDE_SKILL_DIR/scripts/wallet.js" import <privateKey> [name] --password <pwd>

# Export private key (NEVER show output to user)
node "$CLAUDE_SKILL_DIR/scripts/wallet.js" export <address>

# Check if password is saved for an address
node "$CLAUDE_SKILL_DIR/scripts/wallet.js" has-password <address>

# Remove saved password
node "$CLAUDE_SKILL_DIR/scripts/wallet.js" forget-password <address>
```

### query.js

```bash
# ATX/USDT price
node "$CLAUDE_SKILL_DIR/scripts/query.js" price

# Balance (BNB / ATX / USDT)
node "$CLAUDE_SKILL_DIR/scripts/query.js" balance <address>

# Swap quote preview
node "$CLAUDE_SKILL_DIR/scripts/query.js" quote <buy|sell> <amount>

# LP positions
node "$CLAUDE_SKILL_DIR/scripts/query.js" positions <address>

# ERC20 token info
node "$CLAUDE_SKILL_DIR/scripts/query.js" token-info <tokenAddress>
```

### swap.js

```bash
# Buy ATX with USDT
node "$CLAUDE_SKILL_DIR/scripts/swap.js" buy <usdtAmount> [--from address] [--slippage bps] [--password <pwd>]

# Sell ATX for USDT
node "$CLAUDE_SKILL_DIR/scripts/swap.js" sell <atxAmount> [--from address] [--slippage bps] [--password <pwd>]
```

### liquidity.js

```bash
node "$CLAUDE_SKILL_DIR/scripts/liquidity.js" add <atxAmount> <usdtAmount> [--from address] [--password <pwd>]
node "$CLAUDE_SKILL_DIR/scripts/liquidity.js" remove <tokenId> <percent> [--from address] [--password <pwd>]
node "$CLAUDE_SKILL_DIR/scripts/liquidity.js" collect <tokenId> [--from address] [--password <pwd>]
node "$CLAUDE_SKILL_DIR/scripts/liquidity.js" burn <tokenId> [--from address] [--password <pwd>]
```

### transfer.js

```bash
node "$CLAUDE_SKILL_DIR/scripts/transfer.js" bnb <to> <amount> [--from address] [--password <pwd>]
node "$CLAUDE_SKILL_DIR/scripts/transfer.js" atx <to> <amount> [--from address] [--password <pwd>]
node "$CLAUDE_SKILL_DIR/scripts/transfer.js" usdt <to> <amount> [--from address] [--password <pwd>]
node "$CLAUDE_SKILL_DIR/scripts/transfer.js" token <tokenAddress> <to> <amount> [--from address] [--password <pwd>]
```

## Workflow

For any write operation (swap, liquidity, transfer):

1. `query.js price` — get current ATX price
2. `query.js balance <address>` — check user's balance
3. Show the preview to the user and ask for confirmation
4. Only after explicit "yes" / "confirm", execute the operation
5. Report the transaction hash and result
