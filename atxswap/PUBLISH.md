# Publish Notes

This directory is published to ClawHub and OpenClaw as a single skill bundle
that also works as a standalone `skills.sh`-compatible package (Claude /
Cursor / Codex CLI). The same SKILL.md frontmatter declares both conventions
so a single source of truth covers all clients.

## Pre-publish checklist

1. Install dependencies inside this directory (`npm install`).
2. Run the local read-only checks:
   - `node scripts/wallet.js list`
   - `node scripts/query.js price`
   - `node scripts/query.js quote buy 1`
3. Confirm the version in `SKILL.md` and `package.json` matches.
4. Confirm the folder does not include secrets, keystore files, or `node_modules/`.

## Validate

```bash
openclaw skills validate ./skills/atxswap/SKILL.md
```

## Publish with OpenClaw CLI

```bash
openclaw skills publish ./skills/atxswap
```

## Publish with ClawHub CLI

```bash
clawhub publish ./skills/atxswap \
  --slug atxswap \
  --name "ATXSwap" \
  --version 0.0.1 \
  --tags latest,atxswap,atx,bsc,trading
```

## Suggested changelog

```text
Initial OpenClaw and ClawHub release for ATX wallet, query, swap, liquidity,
and transfer workflows on BSC.
```
