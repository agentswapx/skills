#!/usr/bin/env node
import { createClient, getPassword, parseArgs, fmt } from "./_helpers.js";
import { parseEther } from "../../../packages/atx-agent-sdk/dist/index.js";

const client = await createClient();
const args = parseArgs(process.argv.slice(2));
const command = args._[0];

if (!command) {
  console.error("Usage: liquidity.js <add|remove|collect|burn> [args] [--from address]");
  process.exit(1);
}

const password = getPassword();
const fromAddress = args.from || client.wallet.list()[0]?.address;
if (!fromAddress) { console.error("No wallet found. Create one first."); process.exit(1); }

const wallet = await client.wallet.load(fromAddress, password);

switch (command) {
  case "add": {
    const atxAmount = args._[1];
    const usdtAmount = args._[2];
    if (!atxAmount || !usdtAmount) {
      console.error("Usage: liquidity.js add <atxAmount> <usdtAmount> [--from address]");
      process.exit(1);
    }
    const result = await client.liquidity.addLiquidity(
      wallet,
      parseEther(atxAmount),
      parseEther(usdtAmount),
      { fullRange: true },
    );
    console.log(JSON.stringify({ action: "add liquidity", txHash: result.txHash }, null, 2));
    break;
  }

  case "remove": {
    const tokenId = args._[1];
    const percent = args._[2];
    if (!tokenId || !percent) {
      console.error("Usage: liquidity.js remove <tokenId> <percent> [--from address]");
      process.exit(1);
    }
    const result = await client.liquidity.removeLiquidity(wallet, BigInt(tokenId), parseInt(percent));
    console.log(JSON.stringify({ action: "remove liquidity", txHash: result.txHash }, null, 2));
    break;
  }

  case "collect": {
    const tokenId = args._[1];
    if (!tokenId) { console.error("Usage: liquidity.js collect <tokenId> [--from address]"); process.exit(1); }
    const result = await client.liquidity.collectFees(wallet, BigInt(tokenId));
    console.log(JSON.stringify({ action: "collect fees", txHash: result.txHash }, null, 2));
    break;
  }

  case "burn": {
    const tokenId = args._[1];
    if (!tokenId) { console.error("Usage: liquidity.js burn <tokenId> [--from address]"); process.exit(1); }
    const result = await client.liquidity.burnPosition(wallet, BigInt(tokenId));
    console.log(JSON.stringify({ action: "burn position", txHash: result.txHash }, null, 2));
    break;
  }

  default:
    console.error("Usage: liquidity.js <add|remove|collect|burn> [args]");
    process.exit(1);
}
