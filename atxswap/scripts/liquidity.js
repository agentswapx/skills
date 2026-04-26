#!/usr/bin/env node
import { createClient, loadWallet, parseArgs, exitError, runMain } from "./_helpers.js";
import { parseEther } from "atxswap-sdk";

const POOL_TOKEN0_ABI = [
  {
    type: "function",
    name: "token0",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
];

const V3_MIN_TICK = -887200;
const V3_MAX_TICK = 887200;
const LOG_BASE = Math.log(1.0001);

function priceToTick(price) {
  if (price <= 0) return 0;
  return Math.round(Math.log(price) / LOG_BASE);
}

function nearestUsableTick(tick, tickSpacing) {
  return Math.round(tick / tickSpacing) * tickSpacing;
}

function feeToTickSpacing(fee) {
  switch (fee) {
    case 100:
      return 1;
    case 500:
      return 10;
    case 2500:
      return 50;
    case 10000:
      return 200;
    default:
      return 50;
  }
}

/**
 * @param {number} human price: USDT per 1 ATX (18-dec pool, same as frontend)
 * @param {boolean} isAtxToken0 from pool
 */
function humanUsdtPerAtxToToken1OverToken0(h, isAtxToken0) {
  if (h <= 0) {
    throw new Error("min-price and max-price must be positive (USDT per 1 ATX)");
  }
  return isAtxToken0 ? h : 1 / h;
}

/**
 * @returns {{ tickLower: number, tickUpper: number }}
 */
function humanPriceRangeToTicks(minHuman, maxHuman, isAtxToken0, tickSpacing) {
  const rawA = humanUsdtPerAtxToToken1OverToken0(minHuman, isAtxToken0);
  const rawB = humanUsdtPerAtxToToken1OverToken0(maxHuman, isAtxToken0);
  let t0 = nearestUsableTick(priceToTick(rawA), tickSpacing);
  let t1 = nearestUsableTick(priceToTick(rawB), tickSpacing);
  let tickLower = Math.min(t0, t1);
  let tickUpper = Math.max(t0, t1);
  if (tickLower < V3_MIN_TICK) tickLower = V3_MIN_TICK;
  if (tickUpper > V3_MAX_TICK) tickUpper = V3_MAX_TICK;
  if (tickLower >= tickUpper) {
    tickUpper = tickLower + tickSpacing;
  }
  if (tickUpper > V3_MAX_TICK) {
    tickUpper = V3_MAX_TICK;
    tickLower = tickUpper - tickSpacing;
  }
  return { tickLower, tickUpper };
}

async function isAtxToken0(client) {
  const token0 = await client.publicClient.readContract({
    address: client.contracts.pool,
    abi: POOL_TOKEN0_ABI,
    functionName: "token0",
  });
  return token0.toLowerCase() === client.contracts.atx.toLowerCase();
}

await runMain(async () => {
  const client = await createClient();
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command) {
    exitError(
      "Usage: liquidity.js <add|remove|collect|burn> [args] [--from address] [--password <pwd>]\n" +
        "  add: optional range --full-range | --tick-lower <n> --tick-upper <n> | --min-price <p> --max-price <p> (USDT per 1 ATX); optional --slippage-bps <n>",
    );
  }

  const fromAddress = args.from || client.wallet.list()[0]?.address;
  if (!fromAddress) exitError("No wallet found. Create one first.");

  const wallet = await loadWallet(client, fromAddress, args);

  switch (command) {
    case "add": {
      const atxAmount = args._[1];
      const usdtAmount = args._[2];
      if (!atxAmount || !usdtAmount) {
        exitError(
          "Usage: liquidity.js add <atxAmount> <usdtAmount> [--from address] [--full-range] [--tick-lower n --tick-upper n] [--min-price p --max-price p] [--slippage-bps n]\n" +
            "  Default: full range. Custom: either tick pair or min/max price (USDT per 1 ATX), not both. Price bounds match the web app / Pancake (token0/token1 + tickSpacing).",
        );
      }

      const hasTick =
        args["tick-lower"] !== undefined && args["tick-lower"] !== true && args["tick-upper"] !== undefined && args["tick-upper"] !== true;
      const hasPrice =
        args["min-price"] !== undefined && args["min-price"] !== true && args["max-price"] !== undefined && args["max-price"] !== true;
      const wantFull = args["full-range"] === true || args["full-range"] === "true";

      if (wantFull && (hasTick || hasPrice)) {
        exitError("Do not combine --full-range with --tick-lower/--tick-upper or --min-price/--max-price");
      }
      if (hasTick && hasPrice) {
        exitError("Use either --tick-lower/--tick-upper or --min-price/--max-price, not both");
      }
      if ((args["tick-lower"] !== undefined && !hasTick) || (args["tick-upper"] !== undefined && !hasTick)) {
        exitError("When using ticks, pass both --tick-lower and --tick-upper");
      }
      if ((args["min-price"] !== undefined && !hasPrice) || (args["max-price"] !== undefined && !hasPrice)) {
        exitError("When using price range, pass both --min-price and --max-price (USDT per 1 ATX)");
      }

      let liqOptions;
      let meta = {};

      if (hasPrice) {
        const minP = parseFloat(String(args["min-price"]));
        const maxP = parseFloat(String(args["max-price"]));
        if (!Number.isFinite(minP) || !Number.isFinite(maxP) || minP <= 0 || maxP <= 0) {
          exitError("min-price and max-price must be positive numbers (USDT per 1 ATX)");
        }
        const spacing = feeToTickSpacing(client.poolFee);
        const t0 = await isAtxToken0(client);
        const { tickLower, tickUpper } = humanPriceRangeToTicks(minP, maxP, t0, spacing);
        liqOptions = { fullRange: false, tickLower, tickUpper };
        meta = {
          minPrice: minP,
          maxPrice: maxP,
          tickLower,
          tickUpper,
          isAtxToken0: t0,
          tickSpacing: spacing,
        };
      } else if (hasTick) {
        const tickLower = parseInt(String(args["tick-lower"]), 10);
        const tickUpper = parseInt(String(args["tick-upper"]), 10);
        if (!Number.isFinite(tickLower) || !Number.isFinite(tickUpper)) {
          exitError("tick-lower and tick-upper must be integers");
        }
        let tl = Math.min(tickLower, tickUpper);
        let tu = Math.max(tickLower, tickUpper);
        if (tl < V3_MIN_TICK) tl = V3_MIN_TICK;
        if (tu > V3_MAX_TICK) tu = V3_MAX_TICK;
        if (tl >= tu) {
          exitError("tick-lower and tick-upper must allow tickLower < tickUpper after normalizing to pool limits");
        }
        liqOptions = { fullRange: false, tickLower: tl, tickUpper: tu };
        meta = { tickLower: tl, tickUpper: tu };
      } else {
        liqOptions = { fullRange: true };
        meta = { fullRange: true };
      }

      if (args["slippage-bps"] !== undefined && args["slippage-bps"] !== true) {
        const b = parseInt(String(args["slippage-bps"]), 10);
        if (!Number.isFinite(b) || b < 0 || b > 10_000) {
          exitError("slippage-bps must be between 0 and 10000");
        }
        liqOptions = { ...liqOptions, slippageBps: b };
        meta = { ...meta, slippageBps: b };
      }

      const result = await client.liquidity.addLiquidity(
        wallet,
        parseEther(atxAmount),
        parseEther(usdtAmount),
        liqOptions,
      );
      console.log(
        JSON.stringify(
          { action: "add liquidity", txHash: result.txHash, range: meta },
          null,
          2,
        ),
      );
      break;
    }

    case "remove": {
      const tokenId = args._[1];
      const percent = args._[2];
      if (!tokenId || !percent) {
        exitError("Usage: liquidity.js remove <tokenId> <percent> [--from address]");
      }
      const result = await client.liquidity.removeLiquidity(wallet, BigInt(tokenId), parseInt(percent));
      console.log(JSON.stringify({ action: "remove liquidity", txHash: result.txHash }, null, 2));
      break;
    }

    case "collect": {
      const tokenId = args._[1];
      if (!tokenId) exitError("Usage: liquidity.js collect <tokenId> [--from address]");
      const result = await client.liquidity.collectFees(wallet, BigInt(tokenId));
      console.log(JSON.stringify({ action: "collect fees", txHash: result.txHash }, null, 2));
      break;
    }

    case "burn": {
      const tokenId = args._[1];
      if (!tokenId) exitError("Usage: liquidity.js burn <tokenId> [--from address]");
      const result = await client.liquidity.burnPosition(wallet, BigInt(tokenId));
      console.log(JSON.stringify({ action: "burn position", txHash: result.txHash }, null, 2));
      break;
    }

    default:
      exitError("Usage: liquidity.js <add|remove|collect|burn> [args]");
  }
});
