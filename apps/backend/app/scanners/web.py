import asyncio
import socket
import ssl
from datetime import datetime, timezone

import httpx

from ..models import CheckResult

HEADERS = {'strict-transport-security', 'content-security-policy', 'x-content-type-options', 'x-frame-options', 'referrer-policy'}
ADMIN_PATHS = ('/wp-admin', '/wp-login.php', '/admin')
WHY_IT_MATTERS = 'This security signal affects business risk.'
RECOMMENDED_FIX = 'Review the finding and take the recommended action.'


def finding(title: str, status: str, summary: str, evidence: list[str] | None = None, severity: str = 'medium') -> CheckResult:
    return CheckResult(
        title=title,
        category='Website security',
        status=status,
        severity=severity,
        plainEnglishSummary=summary,
        whyItMatters=WHY_IT_MATTERS,
        recommendedFix=RECOMMENDED_FIX,
        evidence=evidence or [],
    )


async def ssl_days(domain: str) -> int | None:
    def inspect() -> int | None:
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=5) as raw:
                with context.wrap_socket(raw, server_hostname=domain) as connection:
                    certificate = connection.getpeercert()
            expires = datetime.strptime(certificate['notAfter'], '%b %d %H:%M:%S %Y %Z').replace(tzinfo=timezone.utc)
            return (expires - datetime.now(timezone.utc)).days
        except Exception:
            # Network, DNS, SSL, timeout, and malformed-certificate failures are
            # inconclusive findings, not reasons to abort an otherwise useful scan.
            return None

    try:
        return await asyncio.to_thread(inspect)
    except Exception:
        return None


def ssl_result(days: int | None) -> CheckResult:
    if days is None:
        status, summary = 'needs_review', 'We could not confirm the SSL certificate expiry date. Ask your website provider to check it.'
    elif days < 0:
        status, summary = 'fail', f'The SSL certificate expired {-days} days ago. Renew it immediately.'
    elif days < 30:
        status, summary = 'warning', f'The SSL certificate expires in {days} days. Renew it as a high priority.'
    elif days <= 60:
        status, summary = 'warning', f'The SSL certificate expires in {days} days. Plan its renewal soon.'
    else:
        status, summary = 'pass', f'The SSL certificate is valid for another {days} days.'
    severity = 'critical' if days is not None and days < 0 else ('high' if days is not None and days < 30 else 'medium')
    return finding('SSL certificate expiry', status, summary, [f'days_remaining: {days}'], severity)


def build_http_status_finding(response: httpx.Response | None) -> CheckResult:
    status_code = response.status_code if response is not None else None
    if status_code is None:
        status, summary = 'needs_review', 'The scanner could not reach the website.'
    elif status_code == 200:
        status, summary = 'pass', 'The website returned HTTP 200 and is reachable.'
    elif status_code in (301, 302):
        status, summary = 'pass', 'The website redirects successfully.'
    elif status_code == 403:
        status, summary = 'needs_review', 'The website returned HTTP 403. This may mean the site blocks automated scanners.'
    elif status_code == 404:
        status, summary = 'warning', 'The website returned HTTP 404.'
    elif status_code >= 500:
        status, summary = 'warning', 'The website returned a server error.'
    elif status_code >= 400:
        status, summary = 'warning', f'The website returned HTTP {status_code}.'
    else:
        status, summary = 'needs_review', f'The website returned an unexpected HTTP {status_code} response.'
    return finding('HTTP status', status, summary, [f'status_code: {status_code}'])


async def scan_web(domain: str) -> list[CheckResult]:
    try:
        response = None
        paths = []
        async with httpx.AsyncClient(timeout=8, follow_redirects=True) as client:
            try:
                response = await client.get(f'https://{domain}')
            except Exception:
                response = None

            async def inspect_path(path: str) -> dict[str, str | int | None]:
                try:
                    path_response = await client.get(f'https://{domain}{path}')
                    return {'path': path, 'status_code': path_response.status_code}
                except Exception:
                    return {'path': path, 'status_code': None}

            paths = await asyncio.gather(*(inspect_path(path) for path in ADMIN_PATHS))

        days = await ssl_days(domain)
        missing = sorted(HEADERS - set(key.lower() for key in response.headers)) if response is not None else sorted(HEADERS)
        exposed = [str(item['path']) for item in paths if item['status_code'] in (200, 401, 403)]
        path_evidence = [f"{item['path']}: {item['status_code']}" for item in paths]
        return [
            finding('HTTPS connection', 'pass' if response is not None else 'needs_review', 'The website uses an encrypted HTTPS connection.' if response is not None else 'The scanner could not reach the website securely over HTTPS.'),
            ssl_result(days),
            finding('Security headers', 'pass' if not missing else 'warning', 'Recommended browser protections are in place.' if not missing else 'Ask your website provider to add the missing browser protections.', [f'missing_header: {header}' for header in missing]),
            finding('Common admin paths', 'warning' if exposed else 'pass', 'Common admin pages may be reachable. Protect them with strong passwords and multi-factor authentication.' if exposed else 'No common admin pages appeared to be exposed.', path_evidence + [f'exposed: {path}' for path in exposed]),
            build_http_status_finding(response),
        ]
    except Exception as exc:
        return [finding('Website scan', 'needs_review', 'The website scan could not be completed. Ask your website provider to investigate.', [f'error_type: {type(exc).__name__}'])]
