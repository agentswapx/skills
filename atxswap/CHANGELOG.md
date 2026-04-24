# Changelog

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
