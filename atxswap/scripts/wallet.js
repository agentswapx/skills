#!/usr/bin/env node
import {
  createClient,
  exportKeystore,
  getDefaultKeystorePath,
  parseArgs,
  fmt,
  exitError,
  runMain,
  resolveNewPassword,
} from "./_helpers.js";
import { writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

await runMain(async () => {
  const client = await createClient();
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  switch (command) {
    case "create": {
      const existing = client.wallet.list();
      if (existing.length > 0) {
        exitError(`Wallet already exists (${existing[0].address}). Only one wallet is allowed per skill instance.`);
      }
      const password = await resolveNewPassword(args);
      const name = args._[1];
      const result = await client.wallet.create(password, name);
      console.log(JSON.stringify({
        action: "create",
        address: result.address,
        keystoreFile: result.keystoreFile,
        keystoreDir: getDefaultKeystorePath(),
        name: name || null,
        passwordSaved: result.passwordSaved,
        ...(result.passwordSaveError
          ? { passwordSaveError: result.passwordSaveError }
          : {}),
      }, null, 2));
      break;
    }

    case "list": {
      const wallets = client.wallet.list();
      if (wallets.length === 0) {
        console.log(JSON.stringify({ wallets: [] }, null, 2));
        break;
      }
      const results = [];
      for (const w of wallets) {
        const entry = { address: w.address, name: w.name || null };
        try {
          const bal = await client.query.getBalance(w.address);
          entry.bnb = fmt(bal.bnb);
          entry.atx = fmt(bal.atx);
          entry.usdt = fmt(bal.usdt);
        } catch {}
        results.push(entry);
      }
      console.log(JSON.stringify({ wallets: results }, null, 2));
      break;
    }

    case "export": {
      const address = args._[1];
      if (!address) {
        exitError("Usage: wallet.js export <address> [--out <file>]");
      }
      const { keystore, keystoreFile } = exportKeystore(client, address);
      const outPath = typeof args.out === "string" ? resolvePath(args.out) : null;
      const json = JSON.stringify(keystore, null, 2);
      if (outPath) {
        writeFileSync(outPath, json);
        console.log(JSON.stringify({
          action: "export",
          address,
          format: "keystore-v3",
          source: keystoreFile,
          output: outPath,
        }, null, 2));
      } else {
        console.log(json);
      }
      break;
    }

    case "forget-password": {
      const address = args._[1];
      if (!address) exitError("Usage: wallet.js forget-password <address>");
      await client.wallet.forgetPassword(address);
      console.log(JSON.stringify({ action: "forget-password", address, success: true }, null, 2));
      break;
    }

    case "has-password": {
      const address = args._[1];
      if (!address) exitError("Usage: wallet.js has-password <address>");
      const saved = await client.wallet.hasSavedPassword(address);
      console.log(JSON.stringify({ address, hasSavedPassword: saved }, null, 2));
      break;
    }

    default:
      exitError("Usage: wallet.js <create|list|export|forget-password|has-password> [args] [--password <pwd>]");
  }
});
