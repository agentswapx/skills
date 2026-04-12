---
name: atx-trading-openclaw
description: Manage ATX on BSC with wallet creation, balance and quote queries, PancakeSwap V3 swaps, liquidity actions, and token transfers. Use when the user mentions ATX, BSC, PancakeSwap V3, wallet setup, price checks, buying, selling, liquidity, fees, or token transfers.
version: 1.0.0
metadata:
  author: agentswapx
  openclaw:
    requires:
      bins:
        - node
        - npm
    homepage: https://github.com/agentswapx/skills/tree/main/skills/atx-trading-openclaw
    os:
      - linux
      - macos
---

# ATX Trading For OpenClaw

Use this skill for real ATX operations on BSC: wallet setup, price and balance
queries, PancakeSwap V3 swaps, liquidity actions, and BNB or ERC20 transfers.

## Skill Scope

- Create or import the single wallet used by this skill installation
- Query ATX price, balances, LP positions, quotes, and arbitrary ERC20 info
- Buy or sell ATX against USDT on PancakeSwap V3
- Add liquidity, remove liquidity, collect fees, or burn empty LP NFTs
- Transfer BNB, ATX, USDT, or arbitrary ERC20 tokens

## Before First Use

This skill ships its own Node scripts and depends on `atx-agent-sdk`.

1. Open the skill directory where this `SKILL.md` is installed.
2. Run `npm install` there before using any script.
3. If `npm install` fails, stop and report the dependency error instead of guessing.

If the skill is installed into an OpenClaw workspace, the common location is
`skills/atx-trading-openclaw/`.

## Script Location

Run commands from the skill directory so relative imports resolve correctly.

Example:

```bash
cd skills/atx-trading-openclaw && npm install
cd skills/atx-trading-openclaw && node scripts/wallet.js list
```

If the skill was installed into a shared OpenClaw directory instead of the
workspace, use the absolute path to the installed skill folder.

## Runtime Notes

- `BSC_RPC_URL` is optional. If it is set, scripts use it for all BSC reads and writes.
- Wallet files live under `~/.config/atx-agent/keystore`.
- Secure secrets live under `~/.config/atx-agent/`.
- Only one wallet is allowed per skill installation.
- `query.js quote` can return a JSON error if the configured Quoter or RPC rejects the simulation. If that happens, surface the error and do not proceed to a write.

## Password Rules

When the user asks to create or import a wallet:

1. Ask the user for a password first.
2. Pass it with `--password <pwd>` if running non-interactively.
3. Never generate a password for the user.
4. Never print the password back to the chat.

For swap, transfer, and liquidity writes, rely on auto-unlock first. Only ask
for the password if auto-unlock fails.

## Hard Safety Rules

1. Treat all BSC writes as real-asset operations.
2. Never reveal private keys or passwords in chat.
3. Always run a preview before write actions.
4. Always summarize the preview and wait for explicit confirmation before swap,
   transfer, or liquidity writes.
5. Never execute large trades without an explicit user confirmation.
6. Never show the output of `wallet.js export` to the user.

## Required Preview Flow

Before every write action:

1. Query the price, quote, balance, or positions that match the requested action.
2. Summarize the preview in plain language.
3. Ask the user to confirm.
4. Execute the write command only after confirmation.
5. Return the transaction hash and the key result fields.

## High-Value Commands

### Wallet

```bash
cd skills/atx-trading-openclaw && node scripts/wallet.js create [name] --password <pwd>
cd skills/atx-trading-openclaw && node scripts/wallet.js list
cd skills/atx-trading-openclaw && node scripts/wallet.js import <privateKey> [name] --password <pwd>
cd skills/atx-trading-openclaw && node scripts/wallet.js has-password <address>
cd skills/atx-trading-openclaw && node scripts/wallet.js forget-password <address>
```

### Read-only queries

```bash
cd skills/atx-trading-openclaw && node scripts/query.js price
cd skills/atx-trading-openclaw && node scripts/query.js balance <address>
cd skills/atx-trading-openclaw && node scripts/query.js quote <buy|sell> <amount>
cd skills/atx-trading-openclaw && node scripts/query.js positions <address>
cd skills/atx-trading-openclaw && node scripts/query.js token-info <tokenAddress>
```

### Write commands

```bash
cd skills/atx-trading-openclaw && node scripts/swap.js buy <usdtAmount> [--from address] [--slippage bps] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/swap.js sell <atxAmount> [--from address] [--slippage bps] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/liquidity.js add <atxAmount> <usdtAmount> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/liquidity.js remove <tokenId> <percent> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/liquidity.js collect <tokenId> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/liquidity.js burn <tokenId> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/transfer.js bnb <to> <amount> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/transfer.js atx <to> <amount> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/transfer.js usdt <to> <amount> [--from address] [--password <pwd>]
cd skills/atx-trading-openclaw && node scripts/transfer.js token <tokenAddress> <to> <amount> [--from address] [--password <pwd>]
```

## When To Refuse Or Pause

- Missing wallet but the user requests a write action
- Missing confirmation for swap, transfer, or liquidity writes
- `npm install` has not been run successfully in the skill directory
- RPC, dependency, or wallet-unlock errors that make the state unclear

## Publish Notes

This folder is the OpenClaw and ClawHub version of the ATX trading skill.
Keep it separate from `skills/atx-trading`, which is reserved for the
`skills.sh` variant.
