#!/usr/bin/env node
import { createClient, getPassword, parseArgs, fmt } from "./_helpers.js";
import { parseEther } from "../../../packages/atx-agent-sdk/dist/index.js";

const client = await createClient();
const args = parseArgs(process.argv.slice(2));
const command = args._[0];

if (!command) {
  console.error("Usage: transfer.js <bnb|atx|usdt|token> <to> <amount> [tokenAddress] [--from address]");
  process.exit(1);
}

const password = getPassword();
const fromAddress = args.from || client.wallet.list()[0]?.address;
if (!fromAddress) { console.error("No wallet found. Create one first."); process.exit(1); }

const wallet = await client.wallet.load(fromAddress, password);

switch (command) {
  case "bnb": {
    const to = args._[1];
    const amount = args._[2];
    if (!to || !amount) { console.error("Usage: transfer.js bnb <to> <amount> [--from address]"); process.exit(1); }
    const result = await client.transfer.sendBnb(wallet, to, parseEther(amount));
    console.log(JSON.stringify({ action: "send BNB", to, amount, txHash: result.txHash }, null, 2));
    break;
  }

  case "atx": {
    const to = args._[1];
    const amount = args._[2];
    if (!to || !amount) { console.error("Usage: transfer.js atx <to> <amount> [--from address]"); process.exit(1); }
    const result = await client.transfer.sendAtx(wallet, to, parseEther(amount));
    console.log(JSON.stringify({ action: "send ATX", to, amount, txHash: result.txHash }, null, 2));
    break;
  }

  case "usdt": {
    const to = args._[1];
    const amount = args._[2];
    if (!to || !amount) { console.error("Usage: transfer.js usdt <to> <amount> [--from address]"); process.exit(1); }
    const result = await client.transfer.sendUsdt(wallet, to, parseEther(amount));
    console.log(JSON.stringify({ action: "send USDT", to, amount, txHash: result.txHash }, null, 2));
    break;
  }

  case "token": {
    const tokenAddr = args._[1];
    const to = args._[2];
    const amount = args._[3];
    if (!tokenAddr || !to || !amount) {
      console.error("Usage: transfer.js token <tokenAddress> <to> <amount> [--from address]");
      process.exit(1);
    }
    const result = await client.transfer.sendToken(wallet, tokenAddr, to, parseEther(amount));
    console.log(JSON.stringify({ action: "send token", token: tokenAddr, to, amount, txHash: result.txHash }, null, 2));
    break;
  }

  default:
    console.error("Usage: transfer.js <bnb|atx|usdt|token> [args]");
    process.exit(1);
}
