const palette = [
  ['Background', 'bg', '#060B14', 'bg-bg'],
  ['Surface', 'surface', '#0E1624', 'bg-surface'],
  ['Elevated', 'elevated', '#131D30', 'bg-elevated'],
  ['Border', 'border', '#22314D', 'bg-border'],
  ['Primary', 'primary', '#2F7DFF', 'bg-primary'],
  ['Secondary', 'secondary', '#23C6D8', 'bg-secondary'],
  ['Success', 'success', '#3CCB7F', 'bg-success'],
  ['Warning', 'warning', '#F0B94B', 'bg-warning'],
  ['Danger', 'danger', '#EF5F77', 'bg-danger']
];

function GuardLayerIcon({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-label="GuardLayer icon">
      <defs>
        <linearGradient id="guardGrad" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F7DFF" />
          <stop offset="1" stopColor="#23C6D8" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="48" height="48" rx="14" fill="#0E1624" stroke="#22314D" />
      <path d="M20 37.5C20 29.5 25.9 23 33.7 22.1" stroke="url(#guardGrad)" strokeWidth="4" strokeLinecap="round" />
      <path d="M24.5 42.8C32.8 46.7 43.2 43.2 47.2 34.9" stroke="#23C6D8" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="39.5" cy="26.5" r="4" fill="#2F7DFF" />
    </svg>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <GuardLayerIcon className="h-9 w-9" />
      <span className="font-display text-2xl font-semibold tracking-tight text-text-primary">
        Guard<span className="text-secondary">Layer</span>
      </span>
    </div>
  );
}

function Section({ title, children, subtitle }) {
  return (
    <section className="panel p-6 md:p-8">
      <h2 className="font-display text-2xl font-semibold text-text-primary">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-3xl text-sm text-text-secondary">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <section className="panel overflow-hidden p-8 md:p-12">
        <div className="absolute" />
        <Wordmark />
        <p className="mt-5 max-w-3xl text-text-secondary">
          A premium, dark-first brand system for an AI-powered website security platform. The identity centers on
          layered detection, perimeter intelligence, and calm enterprise trust rather than loud cybersecurity clichés.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="badge">Modern</span>
          <span className="badge">Protective</span>
          <span className="badge">Enterprise-capable</span>
          <span className="badge">Startup-polished</span>
        </div>
      </section>

      <Section
        title="1) Logo concept direction"
        subtitle="Icon: abstract detection arcs + node over a protected surface. Wordmark: Inter/Sora blend with a subtle two-tone Layer emphasis."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-text-muted">Navbar / wordmark</p>
            <div className="mt-3">
              <Wordmark />
            </div>
          </div>
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-text-muted">Favicon / app icon</p>
            <div className="mt-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-bg">
              <GuardLayerIcon className="h-12 w-12" />
            </div>
          </div>
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-text-muted">Monochrome check</p>
            <div className="mt-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-bg">
              <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                <rect x="8" y="8" width="48" height="48" rx="14" fill="#111827" stroke="#6B7280" />
                <path d="M20 37.5C20 29.5 25.9 23 33.7 22.1" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
                <path d="M24.5 42.8C32.8 46.7 43.2 43.2 47.2 34.9" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
                <circle cx="39.5" cy="26.5" r="4" fill="#E5E7EB" />
              </svg>
            </div>
          </div>
        </div>
      </Section>

      <Section title="2) Color palette" subtitle="Dark-first, premium contrast with controlled accent energy.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {palette.map(([name, token, hex, swatchClass]) => (
            <div key={token} className="rounded-xl border border-border bg-elevated p-4">
              <div className={`h-16 rounded-lg ${swatchClass}`} />
              <p className="mt-3 text-sm font-semibold text-text-primary">{name}</p>
              <p className="text-xs text-text-secondary">{token}</p>
              <p className="font-mono text-xs text-text-muted">{hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="3) Typography direction" subtitle="Sora for confident headlines, Inter for product clarity and dense UI legibility.">
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-semibold text-text-primary">GuardLayer secures the edge before breaches begin.</h1>
          <p className="max-w-4xl text-base leading-relaxed text-text-secondary">
            Inter is the default for body, dashboard widgets, forms, and docs because it performs well at small sizes. Use
            Sora for hero headlines, section titles, pricing headings, and short high-impact statements.
          </p>
          <p className="font-mono text-sm text-secondary">MONITOR • DETECT • VERIFY • RESPOND</p>
        </div>
      </Section>

      <Section
        title="4) UI style guidance"
        subtitle="Rounded-xl/2xl surfaces, thin structured borders, selective glows on primary actions, restrained motion with 150–220ms ease-out transitions."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-border bg-elevated p-4">
            <p className="text-sm font-semibold text-text-primary">Buttons & Tags</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Run Security Scan</button>
              <button className="btn-secondary">View Rules</button>
              <span className="badge border-success/40 text-success">Secure</span>
              <span className="badge border-warning/40 text-warning">Needs Review</span>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-border bg-elevated p-4">
            <p className="text-sm font-semibold text-text-primary">Input / Form</p>
            <label className="text-xs text-text-muted">Website URL</label>
            <input
              className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text-primary outline-none ring-0 transition focus:border-ring focus:ring-2 focus:ring-ring/30"
              defaultValue="https://example.com"
            />
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="5) Dashboard card preview" subtitle="Security posture snapshot card for app + plugin surfaces.">
          <div className="space-y-4 rounded-2xl border border-border bg-elevated p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-text-primary">Threat Overview</h3>
              <span className="badge border-success/40 text-success">Protected</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Critical', '0', 'text-success'],
                ['Warnings', '3', 'text-warning'],
                ['Events', '27', 'text-secondary']
              ].map(([label, value, tone]) => (
                <div key={label} className="rounded-xl border border-border bg-bg p-3">
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className={`mt-1 text-xl font-semibold ${tone}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="6) Pricing card preview" subtitle="Premium but readable conversion design for landing pages.">
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/15 to-elevated p-5 shadow-glow">
            <p className="text-sm font-semibold text-secondary">GuardLayer Pro</p>
            <p className="mt-2 font-display text-4xl text-text-primary">$29<span className="text-base text-text-secondary">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              <li>• AI vulnerability monitoring</li>
              <li>• Malware + file change detection</li>
              <li>• Suspicious login alerts</li>
              <li>• Weekly security posture reports</li>
            </ul>
            <button className="btn-primary mt-5 w-full">Start 14-day trial</button>
          </div>
        </Section>
      </div>

      <Section
        title="7) Brand usage ideas + Tailwind tokens"
        subtitle="System scales across navbar, sidebar, social avatars, plugin icon, docs and security report covers."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-elevated p-4 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary">Usage map</p>
            <ul className="mt-2 space-y-1">
              <li>• Navbar: full wordmark on dark transparent header.</li>
              <li>• Sidebar: icon mark + text collapsed at narrow widths.</li>
              <li>• Plugin icon: square glyph with strong inner contrast.</li>
              <li>• Social avatar: icon-only, deep background, cyan node.</li>
              <li>• PDF reports: large watermark icon + Sora title + Inter body.</li>
            </ul>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-bg p-4 text-xs text-text-secondary">
{`// tailwind token mapping
colors: {
  bg: '#060B14', surface: '#0E1624', elevated: '#131D30', border: '#22314D',
  primary: '#2F7DFF', secondary: '#23C6D8',
  success: '#3CCB7F', warning: '#F0B94B', danger: '#EF5F77', ring: '#58A6FF',
  text: { primary: '#EAF2FF', secondary: '#A8B8D8', muted: '#7E8DA9' }
}
// primary button: bg-primary border-primary/70 text-white hover:brightness-110
// secondary button: bg-elevated border-border text-text-primary hover:text-secondary`}
          </pre>
        </div>
      </Section>
    </main>
  );
}
