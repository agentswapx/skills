#!/usr/bin/env node
import { createClient, getPassword, parseArgs, fmt } from "./_helpers.js";
import { parseEther } from "../../../packages/atx-agent-sdk/dist/index.js";

const client = await createClient();
const args = parseArgs(process.argv.slice(2));
const command = args._[0];
const amount = args._[1];

if (!command || !amount || !["buy", "sell"].includes(command)) {
  console.error("Usage: swap.js <buy|sell> <amount> [--from address] [--slippage bps]");
  process.exit(1);
}

const password = getPassword();
const fromAddress = args.from || client.wallet.list()[0]?.address;
if (!fromAddress) { console.error("No wallet found. Create one first."); process.exit(1); }

const wallet = await client.wallet.load(fromAddress, password);
const amountWei = parseEther(amount);
const slippage = args.slippage ? parseInt(args.slippage) : undefined;

if (command === "buy") {
  const result = await client.swap.buy(wallet, amountWei, slippage);
  console.log(JSON.stringify({
    action: "buy ATX",
    txHash: result.txHash,
    usdtSpent: fmt(result.amountIn),
    atxReceived: fmt(result.amountOut),
  }, null, 2));
} else {
  const result = await client.swap.sell(wallet, amountWei, slippage);
  console.log(JSON.stringify({
    action: "sell ATX",
    txHash: result.txHash,
    atxSold: fmt(result.amountIn),
    usdtReceived: fmt(result.amountOut),
  }, null, 2));
}
