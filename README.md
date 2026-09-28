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

## Agent / Chain Evidence Tools — the suite

All tools are read-only, take no keys, and emit JSON.

| Tool | What it checks / proves | Try |
|---|---|---|
| [mcpdoctor](https://github.com/xka0085-byte/mcp-doctor) | x402 payment endpoint & MCP server preflight | `npx @eidonze/mcpdoctor` |
| [oauthdoctor](https://github.com/xka0085-byte/oauthdoctor) | MCP OAuth discovery diagnostics | `npx oauthdoctor` |
| [x402-reconcile](https://github.com/xka0085-byte/x402-reconcile) | x402 402-challenge inspector | `npx x402-reconcile` |
| [wallet-evidence](https://github.com/xka0085-byte/wallet-evidence) | Solana transaction evidence reports | `npx wallet-evidence` |
| [crosschain-incident](https://github.com/xka0085-byte/crosschain-incident) | cross-chain message incident normalization | `npx crosschain-incident` |
| [ReceiptRail](https://github.com/xka0085-byte/agenttoll) | on-chain x402 delivery receipts (Solana) | [live MCP endpoint](https://agenttoll-receipts.app.workbuddy.host/) |

Live tools page: <https://x402-endpoint-inspection.app.workbuddy.host/tools.html>

MIT © 2026 xka0085-byte (Eidon)
---

## Suite hub

Part of the [Agent / Chain Evidence Tools](https://xka0085-byte.github.io/evidence-tools/) suite — read-only, no-keys, no-payments diagnostics for AI agents on Web3.
