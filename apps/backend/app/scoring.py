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
    severity_rank={'critical':4,'high':3,'medium':2,'low':1}
    priority=sorted((c for c in checks if c.status in ('fail','warning','needs_review')),key=lambda c:severity_rank[c.severity],reverse=True)
    if not priority: return 'No major public-facing risks were found. Keep monitoring your website and email security.'
    top=priority[0]
    return f'Your biggest risk is {top.title.lower()} because {top.plainEnglishSummary.rstrip(".!?").lower()}.'
