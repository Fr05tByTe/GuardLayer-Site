const DEFAULTS = {
  title: 'Security check',
  whyItMatters: 'This check helps assess your business security posture.',
  recommendedAction: 'Review this item with your IT or website provider.',
};

const text = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;

export function normalizeFinding(raw = {}, index = 0) {
  const evidenceValue = raw.evidence ?? raw.raw_evidence;
  const evidence = Array.isArray(evidenceValue)
    ? evidenceValue.map(String).filter(Boolean)
    : evidenceValue == null
      ? []
      : [typeof evidenceValue === 'string' ? evidenceValue : JSON.stringify(evidenceValue)];

  return {
    id: text(raw.id, `finding-${index}`),
    title: text(raw.title, DEFAULTS.title),
    category: text(raw.category, 'Website security'),
    status: text(raw.status, 'needs_review'),
    severity: text(raw.severity, 'medium'),
    plainEnglishSummary: text(raw.plainEnglishSummary ?? raw.plain_english_summary, DEFAULTS.whyItMatters),
    whyItMatters: text(raw.whyItMatters ?? raw.why_it_matters, DEFAULTS.whyItMatters),
    recommendedAction: text(raw.recommendedAction ?? raw.recommended_action ?? raw.recommendedFix ?? raw.recommended_fix, DEFAULTS.recommendedAction),
    evidence: evidence.length ? evidence : ['No evidence recorded.'],
  };
}

export const normalizeFindings = (findings = []) => findings.map(normalizeFinding);

export function mainRiskSummary(findings) {
  const rank = { critical: 4, high: 3, medium: 2, low: 1 };
  const priorities = findings
    .filter(({ status }) => ['fail', 'warning', 'needs_review'].includes(status))
    .sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
  if (!priorities.length) return 'No major public-facing risks were found. Keep monitoring your website and email security.';
  const top = priorities[0];
  return `Your biggest risk is ${top.title.toLowerCase()} because ${top.plainEnglishSummary.replace(/[.!?]+$/, '').toLowerCase()}.`;
}
