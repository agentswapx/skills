# ATX Skills

This directory contains skills that can be invoked by AI Agents to interact with ATX tokens on the BSC chain.

[**中文文档**](./README.zh.md)

- **GitHub**: https://github.com/agentswapx/skills
- **SDK GitHub**: https://github.com/agentswapx/atx-agent-sdk
- **SDK Docs**: See [`packages/atx-agent-sdk/README.md`](../packages/atx-agent-sdk/README.md)

---

## Directory Structure

```
skills/
└── atx-trading/           ← ATX trading skill
    ├── SKILL.md            ← Skill descriptor (for agent framework discovery)
    └── scripts/            ← Executable scripts
        ├── _helpers.js     ← Shared utilities (create client, parse args, format)
        ├── wallet.js       ← Wallet management
        ├── query.js        ← Read-only queries
        ├── swap.js         ← Token swaps
        ├── liquidity.js    ← V3 liquidity management
        └── transfer.js     ← Transfers
```

---

## Prerequisites

1. **Node.js 18+**
2. Build the SDK (all scripts depend on `packages/atx-agent-sdk` build output):

```bash
cd packages/atx-agent-sdk && npm install && npm run build
```

3. Set environment variables:

```bash
export WALLET_PASSWORD="your-password"    # Required for first create/import, auto-saved afterwards
export KEYSTORE_PATH="./keystore"         # Optional, default ./keystore
export BSC_RPC_URL="https://bsc-rpc.publicnode.com"  # Optional, has default
```

> **Auto-save password**: When you create or import a wallet, the password is automatically saved to the system's secure storage (macOS Keychain / Linux Secret Service / master key file). You don't need to set `WALLET_PASSWORD` for subsequent operations.

---

## atx-trading — ATX Trading Skill

### Usage

All scripts are run from the **project root**:

```bash
node skills/atx-trading/scripts/<script>.js <subcommand> [args]
```

### Wallet Management (wallet.js)

```bash
# Create a new wallet (password auto-saved)
node skills/atx-trading/scripts/wallet.js create [name]

# List all wallets with balances
node skills/atx-trading/scripts/wallet.js list

# Import existing private key (password auto-saved)
node skills/atx-trading/scripts/wallet.js import <privateKey> [name]

# Export private key (internal use only, NEVER show to user)
node skills/atx-trading/scripts/wallet.js export <address>

# Check if password is saved
node skills/atx-trading/scripts/wallet.js has-password <address>

# Remove saved password
node skills/atx-trading/scripts/wallet.js forget-password <address>
```

### Read-Only Queries (query.js)

```bash
# Current ATX/USDT price
node skills/atx-trading/scripts/query.js price

# Balance of an address (BNB / ATX / USDT)
node skills/atx-trading/scripts/query.js balance <address>

# Swap quote (preview only)
node skills/atx-trading/scripts/query.js quote <buy|sell> <amount>

# List LP positions for an address
node skills/atx-trading/scripts/query.js positions <address>

# ERC20 token info
node skills/atx-trading/scripts/query.js token-info <tokenAddress>
```

### Token Swap (swap.js)

```bash
# Buy ATX with USDT
node skills/atx-trading/scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps]

# Sell ATX for USDT
node skills/atx-trading/scripts/swap.js sell <atxAmount> [--from address] [--slippage bps]
```

- `--slippage` is in bps (basis points), default 10 (0.1%)
- `--from` specifies the sender wallet address; omit to use the first wallet in keystore

### V3 Liquidity Management (liquidity.js)

```bash
# Add full-range liquidity
node skills/atx-trading/scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address]

# Remove liquidity by percentage
node skills/atx-trading/scripts/liquidity.js remove <tokenId> <percent> [--from address]

# Collect accumulated fees
node skills/atx-trading/scripts/liquidity.js collect <tokenId> [--from address]

# Burn an emptied position NFT
node skills/atx-trading/scripts/liquidity.js burn <tokenId> [--from address]
```

### Transfer (transfer.js)

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

---

## Security Rules

1. **Never** output private keys or passwords in chat
2. **Always** query balance and quote before executing trades or transfers, show to user and wait for confirmation
3. **Never** execute large trades without explicit user confirmation
4. Private keys are stored in keystore V3 encrypted format, never in plaintext

## Workflow

For any write operation (swap, liquidity, transfer), follow this workflow:

1. Query current price and balance with `query.js`
2. Present the information to the user
3. Wait for explicit user confirmation
4. Execute the operation
5. Report the transaction hash and result
