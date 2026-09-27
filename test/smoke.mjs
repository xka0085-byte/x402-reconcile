import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import path from 'node:path';

const cli = path.resolve('bin/x402-reconcile.mjs');
const server = createServer((req, res) => {
  if (req.url === '/good') { res.writeHead(402, { 'content-type': 'application/json' }); res.end(JSON.stringify({ x402Version: 2, accepts: [{ scheme: 'exact', network: 'base', asset: 'USDC', amount: '1000', payTo: '0xabc' }] })); return; }
  if (req.url === '/bad-status') { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{}'); return; }
  if (req.url === '/bad-doc') { res.writeHead(402, { 'content-type': 'text/plain' }); res.end('payment required'); return; }
  if (req.url === '/base64-header') { const document = Buffer.from(JSON.stringify({ x402Version: 2, accepts: [{ scheme: 'exact', network: 'base', asset: 'USDC', amount: '1000', payTo: '0xabc' }] })).toString('base64'); res.writeHead(402, { 'payment-required': document }); res.end(''); return; }
  res.writeHead(404); res.end();
});
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
function run(url) { return new Promise(resolve => { const p = spawn(process.execPath, [cli, 'inspect', url, '--method=POST', '--json']); let out = ''; p.stdout.on('data', x => out += x); p.on('close', code => resolve({ code, report: JSON.parse(out) })); }); }
try {
  const good = await run(`${base}/good`); assert.equal(good.code, 0); assert.equal(good.report.status, 'PASS'); assert.equal(good.report.settlement.status, 'NOT_TESTED'); assert.equal(good.report.delivery.status, 'NOT_TESTED');
  const status = await run(`${base}/bad-status`); assert.equal(status.code, 1); assert.ok(status.report.findings.some(x => x.code === 'NO_402'));
  const doc = await run(`${base}/bad-doc`); assert.equal(doc.code, 1); assert.ok(doc.report.findings.some(x => x.code === 'NO_PAYMENT_DOCUMENT'));
  const encoded = await run(`${base}/base64-header`); assert.equal(encoded.code, 0); assert.equal(encoded.report.status, 'PASS');
  console.log('x402-reconcile smoke tests passed');
} finally { server.close(); }
