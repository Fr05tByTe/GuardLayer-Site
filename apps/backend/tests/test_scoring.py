from app.models import CheckResult
from app.scoring import calculate_score, grade
def check(status): return CheckResult(category='x',name='x',status=status,message='x')
def test_scoring(): assert calculate_score([check('pass'),check('warning'),check('fail')]) == 50
def test_empty_score(): assert calculate_score([]) == 0
def test_grades(): assert [grade(x) for x in (90,70,50,20)] == ['Strong','Good','At risk','Critical']
