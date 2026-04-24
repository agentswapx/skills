# Changelog

## Unreleased

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
