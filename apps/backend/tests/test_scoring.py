from app.models import CheckResult
from app.scoring import calculate_score, grade, main_risk_summary

def check(status,name='x'): return CheckResult(category='x',name=name,status=status,message='x')
def test_scoring(): assert calculate_score([check('pass'),check('warning'),check('fail'),check('needs_review')]) == 56
def test_empty_score(): assert calculate_score([]) == 0
def test_grades(): assert [grade(x) for x in (90,70,50,20)] == ['Strong','Good','At risk','Critical']
def test_missing_dmarc_is_main_risk(): assert 'email impersonation' in main_risk_summary([check('fail','DMARC policy')])
