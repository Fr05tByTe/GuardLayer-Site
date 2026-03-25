import { useEffect, useMemo, useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Early Access', href: '#early-access' }
];

const problemItems = [
  'Malware injected silently',
  'Admin users created by attackers',
  'Plugin vulnerabilities exploited',
  'SEO spam injected',
  'File changes unnoticed',
  'Suspicious logins ignored'
];

const steps = [
  {
    title: 'Connect your website',
    desc: 'Install the WordPress plugin or connect via API in minutes.'
  },
  {
    title: 'AI agents monitor everything',
    desc: 'Track logins, vulnerabilities, traffic anomalies, and file changes continuously.'
  },
  {
    title: 'Get alerts instantly',
    desc: 'Receive alerts in dashboard + email today, with more integrations coming soon.'
  }
];

const agents = [
  'Login Attack Agent',
  'Vulnerability Scanner Agent',
  'File Integrity Agent',
  'Malware Detection Agent',
  'Admin User Monitor',
  'Traffic Anomaly Agent'
];

const features = [
  ['Real-Time Threat Detection', 'Catch attacks early with continuous monitoring and fast triage.'],
  ['Plugin Vulnerability Alerts', 'Track plugin CVEs and high-risk versions before exploitation.'],
  ['File Change Monitoring', 'Detect unauthorized file edits and suspicious code injections quickly.'],
  ['Suspicious Login Detection', 'Identify brute force, credential stuffing, and unusual sign-in behavior.'],
  ['Website Risk Score', 'Understand your website security posture with one clear score.'],
  ['AI Security Reports', 'Get concise summaries with actionable remediation suggestions.']
];

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24 reveal space-y-5 py-16 md:py-20">
      <div className="space-y-3">
        <h2 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">{title}</h2>
        {subtitle ? <p className="max-w-3xl text-text-secondary">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition ${
        scrolled ? 'border-border/80 bg-surface/90' : 'border-transparent bg-bg/30'
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#" className="font-display text-2xl font-semibold tracking-tight text-text-primary">
          Guard<span className="text-secondary">Layer</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-text-secondary transition hover:text-text-primary">
              {item.label}
            </a>
          ))}
          <a href="#early-access">
            <Button>Join Early Access</Button>
          </a>
        </div>

        <Button className="md:hidden h-10 px-3" variant="secondary" onClick={() => setOpen(!open)}>
          Menu
        </Button>
      </nav>
      {open ? (
        <div className="border-b border-border bg-surface/95 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-text-secondary" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <Button onClick={() => setOpen(false)}>Join Early Access</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function DashboardMock() {
  const metrics = useMemo(
    () => [
      ['Threats blocked', '128', 'text-success'],
      ['Suspicious logins', '19', 'text-warning'],
      ['Vulnerability alerts', '7', 'text-secondary'],
      ['File integrity changes', '3', 'text-danger']
    ],
    []
  );

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-b from-primary/10 to-surface p-6 shadow-glow">
      <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">Live Security Panel</p>
          <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs text-success">Protected</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(([label, value, tone]) => (
            <div key={label} className="rounded-xl border border-border bg-bg/70 p-3 transition hover:border-secondary/60">
              <p className="text-xs text-text-muted">{label}</p>
              <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-bg/60 p-4">
          <p className="text-xs text-text-muted">Website Risk Score</p>
          <div className="mt-2 h-2 rounded-full bg-elevated">
            <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-success to-secondary" />
          </div>
          <p className="mt-2 text-sm text-text-secondary">86 / 100 — strong posture, 2 actions recommended.</p>
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <section className="grid scroll-mt-24 items-center gap-12 py-16 md:grid-cols-2 md:py-20" id="hero">
          <div className="reveal space-y-6">
            <span className="badge">AI-Powered Website Security</span>
            <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
              AI Security Agents Watching Your Website 24/7
            </h1>
            <p className="max-w-xl text-lg text-text-secondary">
              GuardLayer continuously monitors your website for vulnerabilities, suspicious activity, malware, and
              attacks — before they become breaches.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Join Early Access</Button>
              <Button size="lg" variant="secondary" disabled>
                View Demo · Coming Soon
              </Button>
            </div>
            <p className="text-sm text-text-muted">Works with WordPress first. Expanding beyond WordPress.</p>
          </div>
          <div className="reveal delay-150">
            <DashboardMock />
          </div>
        </section>

        <Section
          title="Most Websites Are Compromised Without You Knowing"
          subtitle="GuardLayer automatically detects hidden compromise patterns and alerts you before minor incidents turn into breaches."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {problemItems.map((item) => (
              <Card key={item} className="p-5 transition hover:-translate-y-1 hover:border-secondary/70 hover:bg-elevated/90">
                <p className="text-base text-text-secondary">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="how-it-works" title="How GuardLayer Works">
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, idx) => (
              <Card key={step.title} className="relative p-6">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary/50 bg-secondary/10 font-semibold text-secondary">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-text-secondary">{step.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Powered by Autonomous Security Agents"
          subtitle="Every website gets specialized AI-driven monitoring agents that continuously detect anomalies, risks, and suspicious activity."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent} className="group p-5 transition hover:border-primary/60 hover:shadow-glow">
                <p className="font-medium text-text-primary transition group-hover:text-secondary">{agent}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="features" title="Everything You Need to Stay Ahead of Threats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, desc]) => (
              <Card key={title} className="p-6 transition hover:border-secondary/60">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-text-secondary">{desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="pricing" title="Simple Pricing for Smarter Website Security">
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-6">
              <p className="text-sm text-text-muted">Free</p>
              <p className="mt-2 font-display text-4xl font-semibold">$0</p>
              <ul className="mt-4 space-y-2 text-text-secondary">
                <li>• 1 website</li>
                <li>• Basic monitoring</li>
                <li>• Login alerts</li>
                <li>• Weekly scans</li>
                <li>• Website risk score</li>
              </ul>
              <Button className="mt-6 w-full" variant="secondary">
                Join Free Waitlist
              </Button>
            </Card>
            <Card className="border-primary/50 bg-gradient-to-b from-primary/10 to-surface p-6 shadow-glow">
              <p className="text-sm text-secondary">Pro</p>
              <p className="mt-2 font-display text-4xl font-semibold">Early Access</p>
              <ul className="mt-4 space-y-2 text-text-secondary">
                <li>• Multiple websites</li>
                <li>• Real-time monitoring</li>
                <li>• All AI agents</li>
                <li>• Malware detection</li>
                <li>• File change alerts</li>
                <li>• Priority scans + advanced reporting</li>
              </ul>
              <Button className="mt-6 w-full">Request Pro Access</Button>
            </Card>
          </div>
          <p className="text-sm text-text-muted">Early access pricing available. Public pricing launches soon.</p>
        </Section>

        <Section
          id="early-access"
          title="Be First to Secure Your Website"
          subtitle="Join early access to get launch updates, early feature access, and limited free Pro onboarding."
        >
          <Card className="border-secondary/30 bg-gradient-to-br from-surface to-elevated p-6 md:p-8">
            <form
              className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <Input type="email" placeholder="Email" required />
              <Input type="url" placeholder="Website URL (optional)" />
              <Button className="md:self-stretch" type="submit">
                Join Early Access
              </Button>
            </form>
            {submitted ? (
              <p className="mt-4 text-sm text-success">Thanks! You’re on the GuardLayer early-access list.</p>
            ) : null}
          </Card>
        </Section>
      </main>

      <footer className="border-t border-border/80 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-display text-2xl font-semibold">Guard<span className="text-secondary">Layer</span></p>
            <p className="mt-2 text-sm text-text-secondary">AI-powered website security platform for proactive threat defense.</p>
            <p className="mt-2 text-xs text-text-muted">© {new Date().getFullYear()} GuardLayer. All rights reserved.</p>
          </div>
          <div className="flex gap-5 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary">Privacy</a>
            <a href="#" className="hover:text-text-primary">Terms</a>
            <a href="#" className="hover:text-text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
