# Changelog

## 0.0.19

- ClawHub publish: registry tarball bundles `atxswap-sdk` `^0.0.14` (npm 0.0.14).

## 0.0.18

- ClawHub publish: registry tarball bundles `atxswap-sdk` `^0.0.13` (npm 0.0.13).

## 0.0.17

- ClawHub publish: registry tarball bundles `atxswap-sdk` `^0.0.12` (npm 0.0.12).

## 0.0.16

- ClawHub registry publish (no functional change from 0.0.15 bundle).

## 0.0.14

- Bumped bundled `atxswap-sdk` to `^0.0.11` (BSC `DEFAULT_RPC_URLS`: 6 endpoints, `bsc-dataseed.bnbchain.org` first).

## 0.0.13

- Bumped bundled `atxswap-sdk` to `^0.0.10` (default slippage when omitted is now **1%** / `100` bps, was 3%).

## 0.0.12

- Bumped bundled `atxswap-sdk` to `^0.0.9` (npm README / docs links).
- `README` / `README.zh` / `SKILL.md`: link to ATXSwap documentation [team introduction](https://docs.atxswap.com/guide/team) pages.

## 0.0.11

- Bumped bundled `atxswap-sdk` to `^0.0.8` (npm maintenance release).

## 0.0.9

- Bumped `atxswap-sdk` to `^0.0.7` so `wallet.js export` emits
  MetaMask-compatible encrypted keystore V3 JSON. SDK 0.0.7 uses the standard
  Web3 Secret Storage MAC (`keccak256`) and can re-export legacy SDK keystores
  without exposing raw private keys.

## 0.0.8

- Tightened `SKILL.md` safety guidance: before deleting a wallet/keystore, remind
  the user to back up the encrypted keystore and wait for explicit confirmation
  of backup. On forgotten-password and recovery requests, explain local
  encrypted storage and **never** print passwords in chat. Refuse to reveal
  or paste private keys; point users to `wallet.js export` (encrypted
  keystore) only.

## 0.0.7

- Bumped the bundled `atxswap-sdk` dependency to `^0.0.6` so the skill uses the
  cron/headless SecretStore fixes from SDK 0.0.6. Cron, SSH, and other
  non-desktop Linux environments now fall back to the encrypted file backend
  instead of failing on `secret-tool store`.
- `wallet.js create` now includes `passwordSaved` and optional
  `passwordSaveError` in its JSON output, making password persistence failures
  visible without treating them as wallet-creation failures.

## 0.0.6

- Bumped the bundled `atxswap-sdk` dependency to `^0.0.5` so the skill picks up
  the corrected `DEFAULT_CONTRACTS` (production ATX token + ATX/USDT pool
  addresses on BSC mainnet). Required because npm semver treats `^0.0.x` as
  pinned to that exact patch, so older dependency ranges would never have
  resolved to `0.0.5`.
- Version `0.0.5` was intentionally skipped to keep the skill release line
  distinct from the SDK release line going forward.

## 0.0.4

- Bumped the bundled `atxswap-sdk` dependency to `^0.0.3` (required for the new
  `WalletManager.exportKeystore()` API used by `wallet.js export`).
- Removed `wallet.js import <privateKey>` and the public
  `WalletManager.importPrivateKey()` SDK method. Importing an existing private
  key is no longer supported through this skill or the underlying SDK; the only
  way to provision a wallet for this skill instance is `wallet.js create`.
- Replaced `wallet.js export <address>` raw private-key output with **keystore
  V3 JSON** export. The `WalletManager.exportPrivateKey()` SDK method has been
  removed and superseded by `WalletManager.exportKeystore(address)`, which
  returns the on-disk encrypted keystore. `wallet.js export` now also supports
  `--out <file>` to write the keystore to disk instead of printing to stdout.
  The skill no longer has any path that exposes the unencrypted private key.

## 0.0.1

- Initial OpenClaw and ClawHub skill bundle for ATX trading on BSC
- Added self-contained scripts for wallet, query, swap, liquidity, and transfer flows
- Added OpenClaw-oriented `SKILL.md`, publish notes, and localized README files
- Normalized runtime failures to compact JSON errors for cleaner agent output
