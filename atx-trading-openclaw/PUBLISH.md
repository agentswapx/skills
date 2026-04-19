# Publish Notes

This directory is intended to be published to ClawHub as its own skill bundle.

## Pre-publish checklist

1. Install dependencies inside this directory.
2. Run the local read-only checks:
   - `node scripts/wallet.js list`
   - `node scripts/query.js price`
   - `node scripts/query.js quote buy 1`
3. Confirm the version in `SKILL.md` and `package.json` matches.
4. Confirm the folder does not include secrets, keystore files, or `node_modules/`.

## Validate

```bash
openclaw skills validate ./skills/atx-trading-openclaw/SKILL.md
```

## Publish with OpenClaw CLI

```bash
openclaw skills publish ./skills/atx-trading-openclaw
```

## Publish with ClawHub CLI

```bash
clawhub publish ./skills/atx-trading-openclaw \
  --slug atx \
  --name "ATX" \
  --version 0.0.1 \
  --tags latest,atx,bsc,trading
```

## Suggested changelog

```text
Initial OpenClaw and ClawHub release for ATX wallet, query, swap, liquidity,
and transfer workflows on BSC.
```
