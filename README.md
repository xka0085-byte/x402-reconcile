# x402-reconcile

Read-only **x402 payment challenge inspector**. One command shows exactly what an x402 endpoint demands before it serves: scheme, network, asset, amount, payTo — plus response latency and a SHA-256 hash of the response bytes.

Part of the **Agent/Chain Evidence Tools** suite — CLI-first, read-only, no keys, no payments, JSON output.

## Quick start

```bash
npx x402-reconcile inspect https://api.example.com/paid --method=POST --json
```

## What it does

- Detects HTTP 402 and locates the payment document (headers/body)
- Parses `accepts[]`: scheme (`exact`/`base`…), network (CAIP-2), asset, amount, payTo, timeout
- Records response latency and a SHA-256 of the raw response for later comparison
- Exit `0` on parse, `1` on FAIL with machine-readable `findings[]`

Live example (real public endpoint, 2026-09-24): `https://notary.forgemesh.io/api/notarize` returned 402 with `exact` / USDC / amount `1000` — challenge parsed, nothing paid.

## NOT covered (explicitly)

- No payment is ever signed or submitted
- No settlement, delivery, refund, or retry verification — those remain `NOT_TESTED`
- This is a **challenge inspector**, not a settlement monitor (yet)

## Status

Experimental (`0.1.0`). Local smoke tests pass (402 challenge, non-402, missing payment document) and one real public x402 endpoint has been inspected read-only.

## Siblings

[mcpdoctor](https://www.npmjs.com/package/mcpdoctor) · [oauthdoctor](https://www.npmjs.com/package/oauthdoctor) · [wallet-evidence](https://www.npmjs.com/package/wallet-evidence) · [crosschain-incident](https://www.npmjs.com/package/crosschain-incident)

MIT © 2026 xka0085-byte (Eidon)
