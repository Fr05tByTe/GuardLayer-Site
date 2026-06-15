import test from 'node:test';
import assert from 'node:assert/strict';
import { mainRiskSummary, normalizeFinding } from './findings.js';

test('normalizes snake_case fields and object evidence', () => {
  const finding = normalizeFinding({ id:'dmarc', title:'DMARC', category:'Email protection', status:'fail', severity:'high', plain_english_summary:'Missing.', why_it_matters:'Stops spoofing.', recommended_action:'Add it.', evidence:{record:null} });
  assert.equal(finding.plainEnglishSummary, 'Missing.');
  assert.equal(finding.whyItMatters, 'Stops spoofing.');
  assert.equal(finding.recommendedAction, 'Add it.');
  assert.deepEqual(finding.evidence, ['{"record":null}']);
});

test('blank findings always receive card-safe fallbacks', () => {
  const finding = normalizeFinding({ title:' ', whyItMatters:'', recommended_action:null, evidence:[] });
  assert.equal(finding.title, 'Security check');
  assert.equal(finding.whyItMatters, 'This check helps assess your business security posture.');
  assert.equal(finding.recommendedAction, 'Review this item with your IT or website provider.');
  assert.deepEqual(finding.evidence, ['No evidence recorded.']);
});

test('main risk selects the highest severity priority finding', () => {
  const summary = mainRiskSummary([normalizeFinding({title:'Headers',status:'warning',severity:'medium',plainEnglishSummary:'Some are missing'}),normalizeFinding({title:'DMARC',status:'fail',severity:'critical',plainEnglishSummary:'DMARC is missing'})]);
  assert.match(summary, /biggest risk is dmarc because dmarc is missing/i);
});
