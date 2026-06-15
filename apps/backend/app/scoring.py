from .models import CheckResult

WEIGHTS={'fail': 0.0, 'warning': 0.5, 'needs_review': 0.75, 'info': 1.0, 'pass': 1.0}

def calculate_score(checks: list[CheckResult]) -> int:
    if not checks: return 0
    return round(sum(WEIGHTS[c.status] for c in checks)/len(checks)*100)

def grade(score: int) -> str:
    if score >= 85: return 'Strong'
    if score >= 65: return 'Good'
    if score >= 40: return 'At risk'
    return 'Critical'

def main_risk_summary(checks: list[CheckResult]) -> str:
    dmarc=next((c for c in checks if c.title=='DMARC policy' and c.status in ('fail','warning')),None)
    if dmarc: return 'Your biggest risk is email impersonation because DMARC is missing or not enforced.'
    priority=next((c for status in ('fail','warning','needs_review') for c in checks if c.status==status),None)
    if priority: return f'Your biggest area to address is {priority.title.lower()}. {priority.plainEnglishSummary}'
    return 'No major public-facing risks were found. Keep monitoring your website and email security.'
