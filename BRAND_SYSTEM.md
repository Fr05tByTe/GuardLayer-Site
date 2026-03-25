# GuardLayer Brand System (v1 Concept)

## 1) Logo Concept Direction
- **Core idea:** “Intelligent perimeter defense.”
- **Visual metaphor:** layered arcs + signal node over a protected square field.
- **Why it works:** communicates detection, monitoring, and adaptive protection without cliché shields or locks.
- **Logo system:**
  - Full lockup (icon + wordmark) for nav and landing hero.
  - Wordmark-only for tight horizontal placements.
  - Icon-only for favicon/app/plugin/social contexts.
- **Monochrome behavior:** icon keeps shape meaning in single-color mode.

## 2) Wordmark Direction
- Text: `GuardLayer`
- Typography: **Sora 600** with optical tracking tightened slightly.
- Styling recommendation: keep “Guard” neutral and “Layer” accent-tinted for product distinctiveness.
- Tone: modern, enterprise-safe, premium SaaS.

## 3) Icon Mark Direction
- Geometry:
  - Rounded square container for app/plugin compatibility.
  - Primary arc (scan perimeter), secondary arc (layered response), and node (event intelligence).
- Symbolic themes:
  - Layered geometry
  - Detection ring
  - Monitoring pulse
  - Security boundary
- Usage:
  - 16x16/32x32 favicon
  - 48x48+ plugin icon
  - Sidebar collapsed icon
  - Social avatar

## 4) Color Palette (Dark-First)
- `bg`: `#060B14`
- `surface`: `#0E1624`
- `elevated`: `#131D30`
- `border`: `#22314D`
- `primary`: `#2F7DFF`
- `secondary`: `#23C6D8`
- `success`: `#3CCB7F`
- `warning`: `#F0B94B`
- `danger`: `#EF5F77`
- `text.primary`: `#EAF2FF`
- `text.secondary`: `#A8B8D8`
- `text.muted`: `#7E8DA9`

## 5) Typography Direction
- **Headings / Brand moments:** Sora
- **Body / Product UI / Docs:** Inter
- **Optional data text:** JetBrains Mono
- Scale guidance:
  - Hero H1: 48–56px / 600
  - Section heading: 28–34px / 600
  - UI title: 16–20px / 600
  - Body: 14–16px / 400–500

## 6) UI Style Guidance
- **Corners:** 12px to 18px radius, smooth and modern.
- **Cards:** deep surfaces with low-contrast border and subtle shadow.
- **Borders:** always visible in dark mode (`border` token).
- **Glow:** reserve for primary CTAs and active threat signals only.
- **Buttons:**
  - Primary: solid blue with controlled glow.
  - Secondary: elevated neutral with border, cyan hover text.
- **Badges:** soft pill labels with semantic border tones.
- **Inputs:** dark base, clear focus ring (`ring` token).
- **Tables:** zebra-light surface offsets and semantic status chips.
- **Alerts:** compact severity banners with icon + action.
- **Icon style:** stroke-driven, geometric, minimal fill.
- **Spacing rhythm:** 8px baseline; sections 56–88px vertical.
- **Motion:** 150–220ms ease-out, no exaggerated bounces.

## 7) Brand Usage Ideas
- **Navbar logo:** full lockup on transparent dark nav.
- **Favicon:** icon-only simplified version.
- **Dashboard sidebar:** icon + text, collapses to icon only.
- **WordPress plugin UI:** icon with strong high-contrast glyph.
- **Social avatar:** icon-only in deep navy field.
- **Website hero:** logo lockup + confidence statement.
- **Pricing cards:** primary tier highlighted by subtle glow.
- **Security report cover:** oversized watermark icon behind title.

## 8) Tailwind-Ready Design Tokens
```js
// tailwind.config.js -> theme.extend
colors: {
  bg: '#060B14',
  surface: '#0E1624',
  elevated: '#131D30',
  border: '#22314D',
  primary: '#2F7DFF',
  secondary: '#23C6D8',
  success: '#3CCB7F',
  warning: '#F0B94B',
  danger: '#EF5F77',
  ring: '#58A6FF',
  'text-primary': '#EAF2FF',
  'text-secondary': '#A8B8D8',
  'text-muted': '#7E8DA9'
}
```

## 9) React Brand Preview Scope
The implemented preview page includes:
- Logo lockup + icon variants
- Color swatches
- Typography samples
- Button and badge states
- Form input style
- Dashboard status card
- Pricing card sample
- Token and usage rationale block
