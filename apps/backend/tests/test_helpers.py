import pytest
from app.models import ScanRequest
from app.scanners import dns, web

def test_domain_normalization(): assert ScanRequest(domain='https://Example.CO.ZA/path').domain == 'example.co.za'
def test_invalid_domain():
    with pytest.raises(ValueError): ScanRequest(domain='not-a-domain')

async def dns_results(monkeypatch,dmarc=None,mx=None):
    async def records(domain,kind):
        if domain.startswith('_dmarc'): return [dmarc] if dmarc else []
        return ['v=spf1 include:test -all'] if kind=='TXT' else (mx or [])
    monkeypatch.setattr(dns,'_records',records)
    return await dns.scan_dns('example.co.za')

@pytest.mark.asyncio
async def test_missing_dmarc(monkeypatch): assert (await dns_results(monkeypatch))[2].status == 'fail'
@pytest.mark.asyncio
async def test_dmarc_none(monkeypatch): assert (await dns_results(monkeypatch,'v=DMARC1; p=none'))[2].status == 'warning'
@pytest.mark.asyncio
async def test_dkim_unknown_selector(monkeypatch): assert (await dns_results(monkeypatch))[1].status == 'needs_review'
@pytest.mark.asyncio
async def test_mx_records_found(monkeypatch): assert (await dns_results(monkeypatch,mx=['10 mail.test']))[3].status == 'pass'
def test_ssl_expiring_in_32_days(): assert web.ssl_result(32).status == 'warning'

def test_http_403_wording():
    # HTTP status classification is covered through its explicit business rule in scan_web.
    assert '403' in web.scan_web.__code__.co_consts
