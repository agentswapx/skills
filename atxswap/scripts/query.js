#!/usr/bin/env node
import { createClient, parseArgs, fmt, runMain } from "./_helpers.js";
import { parseEther } from "atxswap-sdk";

await runMain(async () => {
  const client = await createClient();
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  switch (command) {
    case "price": {
      const price = await client.query.getPrice();
      console.log(JSON.stringify({
        usdtPerAtx: price.usdtPerAtx,
        atxPerUsdt: price.atxPerUsdt,
        sqrtPriceX96: price.sqrtPriceX96.toString(),
      }, null, 2));
      break;
    }

    case "balance": {
      const address = args._[1];
      if (!address) { console.error("Usage: query.js balance <address>"); process.exit(1); }
      const bal = await client.query.getBalance(address);
      console.log(JSON.stringify({
        address,
        bnb: fmt(bal.bnb),
        atx: fmt(bal.atx),
        usdt: fmt(bal.usdt),
      }, null, 2));
      break;
    }

    case "quote": {
      const direction = args._[1];
      const amount = args._[2];
      if (!direction || !amount) { console.error("Usage: query.js quote <buy|sell> <amount>"); process.exit(1); }
      const amountWei = parseEther(amount);
      const quote = await client.query.getQuote(direction, amountWei);
      console.log(JSON.stringify({
        direction: quote.direction,
        amountIn: fmt(quote.amountIn),
        amountOut: fmt(quote.amountOut),
        priceImpact: (quote.priceImpact * 100).toFixed(4) + "%",
      }, null, 2));
      break;
    }

    case "positions": {
      const address = args._[1];
      const tokenId = args._[2];
      if (!address) { console.error("Usage: query.js positions <address> [tokenId]"); process.exit(1); }
      const queriedPositions = await client.query.getPositions(address, {
        includeCollectableFees: true,
        ...(tokenId ? { tokenId: BigInt(tokenId) } : {}),
      });
      const positions = tokenId
        ? queriedPositions.filter((position) => position.tokenId === BigInt(tokenId))
        : queriedPositions;
      if (positions.length === 0) {
        console.log("No ATX/USDT positions found.");
      } else {
        for (const p of positions) {
          const isAtxToken0 = p.token0.toLowerCase() === client.contracts.atx.toLowerCase();
          const collectable0 = p.collectable0 ?? p.tokensOwed0;
          const collectable1 = p.collectable1 ?? p.tokensOwed1;
          console.log(JSON.stringify({
            tokenId: p.tokenId.toString(),
            fee: p.fee,
            tickLower: p.tickLower,
            tickUpper: p.tickUpper,
            liquidity: p.liquidity.toString(),
            tokensOwed0: fmt(p.tokensOwed0),
            tokensOwed1: fmt(p.tokensOwed1),
            collectable0: fmt(collectable0),
            collectable1: fmt(collectable1),
            collectableAtx: fmt(isAtxToken0 ? collectable0 : collectable1),
            collectableUsdt: fmt(isAtxToken0 ? collectable1 : collectable0),
          }, null, 2));
        }
      }
      break;
    }

    case "token-info": {
      const tokenAddr = args._[1];
      if (!tokenAddr) { console.error("Usage: query.js token-info <tokenAddress>"); process.exit(1); }
      const info = await client.query.getTokenInfo(tokenAddr);
      console.log(JSON.stringify({
        address: info.address,
        name: info.name,
        symbol: info.symbol,
        decimals: info.decimals,
        totalSupply: fmt(info.totalSupply, info.decimals),
      }, null, 2));
      break;
    }

    default:
      console.error("Usage: query.js <price|balance|quote|positions|token-info> [args]");
      process.exit(1);
  }
});
