import { AtxClient } from "atx-agent-sdk";

export async function createClient() {
  const client = new AtxClient({
    rpcUrl: process.env.BSC_RPC_URL,
    keystorePath: process.env.KEYSTORE_PATH || "./keystore",
  });
  await client.ready();
  return client;
}

export function getPassword() {
  return process.env.WALLET_PASSWORD || undefined;
}

export function parseArgs(args) {
  const parsed = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      parsed[key] = args[i + 1] || true;
      i++;
    } else {
      parsed._.push(args[i]);
    }
  }
  return parsed;
}

export function fmt(wei, decimals = 18) {
  const n = Number(wei) / 10 ** decimals;
  if (n === 0) return "0";
  if (n < 0.000001) return n.toExponential(4);
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}
