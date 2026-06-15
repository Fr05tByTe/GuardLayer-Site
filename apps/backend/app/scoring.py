from .models import CheckResult
WEIGHTS={'fail': 0.0, 'warning': 0.5, 'pass': 1.0}
def calculate_score(checks: list[CheckResult]) -> int:
    if not checks: return 0
    return round(sum(WEIGHTS[c.status] for c in checks)/len(checks)*100)
def grade(score: int) -> str:
    if score >= 85: return 'Strong'
    if score >= 65: return 'Good'
    if score >= 40: return 'At risk'
    return 'Critical'
