#!/usr/bin/env node
import { createClient, getPassword, parseArgs, fmt } from "./_helpers.js";

const client = await createClient();
const args = parseArgs(process.argv.slice(2));
const command = args._[0];

switch (command) {
  case "create": {
    const password = getPassword();
    if (!password) { console.error("Error: WALLET_PASSWORD environment variable is required for create"); process.exit(1); }
    const name = args._[1];
    const result = await client.wallet.create(password, name);
    console.log(JSON.stringify({ address: result.address, keystoreFile: result.keystoreFile, name }, null, 2));
    break;
  }

  case "list": {
    const wallets = client.wallet.list();
    if (wallets.length === 0) {
      console.log("No wallets found in keystore.");
      break;
    }
    for (const w of wallets) {
      let balanceInfo = "";
      try {
        const bal = await client.query.getBalance(w.address);
        balanceInfo = ` | BNB: ${fmt(bal.bnb)} | ATX: ${fmt(bal.atx)} | USDT: ${fmt(bal.usdt)}`;
      } catch { /* offline is ok */ }
      console.log(`${w.address}${w.name ? ` (${w.name})` : ""}${balanceInfo}`);
    }
    break;
  }

  case "import": {
    const privateKey = args._[1];
    if (!privateKey) { console.error("Usage: wallet.js import <privateKey> [name]"); process.exit(1); }
    const password = getPassword();
    if (!password) { console.error("Error: WALLET_PASSWORD environment variable is required for import"); process.exit(1); }
    const name = args._[2];
    const result = await client.wallet.importPrivateKey(privateKey, password, name);
    console.log(JSON.stringify({ address: result.address, keystoreFile: result.keystoreFile }, null, 2));
    break;
  }

  case "export": {
    const address = args._[1];
    if (!address) { console.error("Usage: wallet.js export <address>"); process.exit(1); }
    const password = getPassword();
    const pk = await client.wallet.exportPrivateKey(address, password);
    console.log(pk);
    break;
  }

  case "forget-password": {
    const address = args._[1];
    if (!address) { console.error("Usage: wallet.js forget-password <address>"); process.exit(1); }
    await client.wallet.forgetPassword(address);
    console.log(`Password forgotten for ${address}`);
    break;
  }

  case "has-password": {
    const address = args._[1];
    if (!address) { console.error("Usage: wallet.js has-password <address>"); process.exit(1); }
    const saved = await client.wallet.hasSavedPassword(address);
    console.log(saved ? "Yes" : "No");
    break;
  }

  default:
    console.error("Usage: wallet.js <create|list|import|export|forget-password|has-password> [args]");
    process.exit(1);
}
