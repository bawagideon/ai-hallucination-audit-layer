const test = require('node:test');
const assert = require('node:assert');
const { AIHallucinationAuditLayer } = require('../src/index.js');

test('AIHallucinationAuditLayer: validates grounded statements', () => {
  const layer = new AIHallucinationAuditLayer();
  const res = layer.auditAnswer(
    'Our enterprise SLA guarantees ninety-nine point nine uptime. Support responds within one hour.',
    ['Our enterprise SLA guarantees ninety-nine point nine uptime. Premium support responds within one hour.']
  );
  assert.strictEqual(res.isReliable, true);
  assert.strictEqual(res.hallucinatedClaims, 0);
});

test('AIHallucinationAuditLayer: flags ungrounded hallucination', () => {
  const layer = new AIHallucinationAuditLayer();
  const res = layer.auditAnswer(
    'We offer complete refunds within three hundred days with zero questions.',
    ['We offer a strict thirty day refund policy upon review.']
  );
  assert.strictEqual(res.isReliable, false);
  assert.strictEqual(res.hallucinatedClaims, 1);
});
