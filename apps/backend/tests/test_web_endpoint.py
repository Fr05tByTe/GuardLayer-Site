import httpx
import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.scanners import web


async def post_scan(monkeypatch, response):
    async def no_dns_findings(domain):
        return []

    async def fake_get(self, url, **kwargs):
        if isinstance(response, Exception):
            raise response
        return response

    async def no_ssl_days(domain):
        return None

    monkeypatch.setattr('app.main.scan_dns', no_dns_findings)
    monkeypatch.setattr(web, 'ssl_days', no_ssl_days)
    monkeypatch.setattr(httpx.AsyncClient, 'get', fake_get)
    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as client:
        return await client.post('/api/scan/domain', json={'domain': 'example.com'})


@pytest.mark.asyncio
async def test_endpoint_survives_ssl_inspection_failure(monkeypatch):
    async def failed_ssl(domain):
        return None

    monkeypatch.setattr(web, 'ssl_days', failed_ssl)
    result = await post_scan(monkeypatch, httpx.Response(200, headers={}))
    assert result.status_code == 200
    assert next(check for check in result.json()['checks'] if check['title'] == 'SSL certificate expiry')['status'] == 'needs_review'


@pytest.mark.asyncio
async def test_endpoint_survives_none_response(monkeypatch):
    result = await post_scan(monkeypatch, httpx.ConnectError('unreachable'))
    assert result.status_code == 200
    assert next(check for check in result.json()['checks'] if check['title'] == 'HTTP status')['plainEnglishSummary'] == 'The scanner could not reach the website.'


@pytest.mark.asyncio
async def test_endpoint_treats_http_403_as_needs_review(monkeypatch):
    result = await post_scan(monkeypatch, httpx.Response(403, headers={}))
    assert result.status_code == 200
    assert next(check for check in result.json()['checks'] if check['title'] == 'HTTP status')['status'] == 'needs_review'


@pytest.mark.asyncio
async def test_endpoint_builds_http_message_without_undefined_variable(monkeypatch):
    result = await post_scan(monkeypatch, httpx.Response(404, headers={}))
    assert result.status_code == 200
    finding = next(check for check in result.json()['checks'] if check['title'] == 'HTTP status')
    assert finding['plainEnglishSummary'] == 'The website returned HTTP 404.'


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as client:
        result = await client.get('/health')
    assert result.status_code == 200
    assert result.json() == {'status': 'ok'}
