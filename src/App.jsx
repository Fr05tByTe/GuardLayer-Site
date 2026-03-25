export default function App() {
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-2xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.28em] text-cyan-300/80">GuardLayer</p>
        <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl">
          AI Security Agents Watching Your Website 24/7
        </h1>
        <button className="mt-10 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-8 py-3 text-sm font-medium text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300/20">
          Join Early Access
        </button>
      </main>
    </div>
  )
}
