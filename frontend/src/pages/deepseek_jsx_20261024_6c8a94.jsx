import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'Courses', to: '/courses' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Status', href: '#status' },
  { label: 'FAQ', href: '#faq' },
]

const STATS = [
  { value: 12, suffix: '+', label: 'Courses offered' },
  { value: 35, suffix: '+', label: 'Active batches' },
  { value: 2400, suffix: '+', label: 'Students enrolled' },
  { value: 48, suffix: 'h', label: 'Avg. review time' },
]

const TICKER = [
  'Spoken English', 'Arabic', 'Tamil', 'IELTS Prep', 'French',
  'Quran & Tajweed', 'Hindi', 'Business English', 'Urdu', 'German',
]

const COURSES = [
  {
    icon: '🗣️',
    name: 'Spoken English',
    tagline: 'Beginner → Advanced',
    duration: '3 months',
    schedule: 'Sat & Sun · 4.00 – 6.00 PM',
    batches: 3,
    accent: 'from-indigo-500 to-cyan-400',
  },
  {
    icon: '📖',
    name: 'Quran & Tajweed',
    tagline: 'All levels',
    duration: '6 months',
    schedule: 'Weekdays · 5.00 – 7.00 PM',
    batches: 2,
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    icon: '🎯',
    name: 'IELTS Preparation',
    tagline: 'Band 6.5+ track',
    duration: '10 weeks',
    schedule: 'Weekends · 9.00 AM – 12.00 PM',
    batches: 1,
    accent: 'from-amber-500 to-orange-400',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick a course & batch',
    body: 'Browse only what is actually open. Every batch shows its schedule, start date and live seat availability.',
  },
  {
    n: '02',
    title: 'Fill one smart form',
    body: 'Your account is created inside the registration form itself — no separate signup, no back-and-forth.',
  },
  {
    n: '03',
    title: 'Get your registration number',
    body: 'Your unique LLC reference is generated the moment your submission commits. Screenshot it, keep it.',
  },
  {
    n: '04',
    title: 'Track your status',
    body: 'Sign in any time to watch PENDING → UNDER_REVIEW → CONFIRMED update in your own dashboard.',
  },
]

const FEATURES = [
  {
    icon: '🛡️',
    title: 'Atomic registration',
    body: 'Account, profile and application are written in one MySQL transaction. If anything fails, nothing is half-created.',
    span: 'md:col-span-2',
  },
  {
    icon: '🔢',
    title: 'Unguessable-by-design numbering',
    body: 'Sequential LLC-2026-000001 style references, guarded by a row lock and a unique index.',
    span: '',
  },
  {
    icon: '🔒',
    title: 'Bank-grade credentials',
    body: 'Argon2/bcrypt hashing, HTTP-only Secure cookies, and generic auth errors that never leak who exists.',
    span: '',
  },
  {
    icon: '📱',
    title: 'Mobile-first by default',
    body: 'Designed for a phone in one hand on a slow connection — because that is how most students apply.',
    span: '',
  },
  {
    icon: '📨',
    title: 'Verified email, easy recovery',
    body: 'Single-use verification and reset tokens that expire. Get back in without calling the office.',
    span: 'md:col-span-2',
  },
]

const STATUSES = [
  { key: 'PENDING', label: 'Pending', body: 'Application received and waiting in the review queue.', tone: 'indigo' },
  { key: 'UNDER_REVIEW', label: 'Under review', body: 'An administrator is checking your details.', tone: 'cyan' },
  { key: 'CONFIRMED', label: 'Confirmed', body: 'Your seat is secured. Welcome to LLC.', tone: 'emerald' },
]

const TESTIMONIALS = [
  {
    quote:
      'I registered from my phone during a bus ride. Got the number instantly and saw my confirmation two days later.',
    name: 'A. Fathima',
    meta: 'Spoken English · Weekend batch',
  },
  {
    quote:
      'No queues at the office, no paper forms. The dashboard told me exactly where my application stood.',
    name: 'M. Rizwan',
    meta: 'IELTS Preparation · 2026 intake',
  },
  {
    quote:
      'As an administrator I can filter by batch, update a status, and export the list in under a minute.',
    name: 'S. Nithya',
    meta: 'LLC Administration',
  },
]

const FAQS = [
  {
    q: 'Do I need an account before I register?',
    a: 'No. Your account is created as part of the registration form. You choose your email and password while applying, and you sign in afterwards with the same details.',
  },
  {
    q: 'Does submitting the form confirm my admission?',
    a: 'No. Every new registration starts as PENDING. An administrator reviews it and moves it to UNDER_REVIEW and then CONFIRMED. You can follow the change in your dashboard.',
  },
  {
    q: 'What if the batch I want is closed?',
    a: 'Closed batches are not shown in the public catalogue and the server re-checks availability at submission time. If a batch closes while you are filling the form, you will get a clear message instead of a silent failure.',
  },
  {
    q: 'Can I register for more than one course?',
    a: 'Yes. Once you have an account you can add registrations for other courses and batches from your dashboard. Registering twice for the same batch is blocked.',
  },
  {
    q: 'I forgot my password — what now?',
    a: 'Use the “Forgot password” link on the sign-in page. You will receive a single-use reset link that expires shortly after it is issued.',
  },
]

/* ------------------------------------------------------------------ */
/*  SMALL HOOKS                                                        */
/* ------------------------------------------------------------------ */

function useCountUp(target, start) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    const duration = 1600
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return val
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#060916]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-sm font-black text-[#04060f] shadow-lg shadow-cyan-500/20">
            LLC
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-bold tracking-tight text-white">
              Language Learning Campus
            </span>
            <span className="mt-0.5 text-[11px] font-medium tracking-wide text-white/45">
              Kalmunai · Sri Lanka
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="group relative overflow-hidden rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#070B18] shadow-lg shadow-white/10 transition hover:shadow-white/20"
          >
            <span className="relative z-10">Apply now</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white lg:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-[#060916]/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="space-y-1 px-5 py-4">
          {NAV_LINKS.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/5"
              >
                {l.label}
              </a>
            )
          )}
          <div className="flex gap-2 pt-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-white/15 py-2.5 text-center text-sm font-semibold text-white"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-white py-2.5 text-center text-sm font-bold text-[#070B18]"
            >
              Apply now
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* glow */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-indigo-500/30 via-cyan-400/20 to-emerald-400/25 blur-2xl" />

      {/* main card */}
      <div
        className="relative rounded-2xl border border-white/12 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl"
        style={{ animation: 'float 7s ease-in-out infinite' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Registration
            </p>
            <p className="mt-1.5 font-mono text-lg font-bold tracking-tight text-white">
              LLC-2026-000128
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            Pending
          </span>
        </div>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-white/40">Student</dt>
            <dd className="font-semibold text-white">A. Fathima</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-white/40">Course</dt>
            <dd className="font-semibold text-white">Spoken English</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-white/40">Batch</dt>
            <dd className="font-semibold text-white">Weekend · Apr 2026</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-white/40">Submitted</dt>
            <dd className="font-semibold text-white">12 Apr 2026</dd>
          </div>
        </dl>

        {/* progress */}
        <div className="mt-6">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i === 0
                    ? 'bg-gradient-to-r from-indigo-400 to-cyan-400'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <p className="mt-2.5 text-[11px] font-medium text-white/35">
            Step 1 of 5 · waiting for review
          </p>
        </div>
      </div>

      {/* floating chip */}
      <div
        className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-xl border border-white/12 bg-[#0b1020]/95 px-3.5 py-2.5 shadow-xl backdrop-blur-xl sm:-left-8"
        style={{ animation: 'float 5.5s ease-in-out infinite reverse' }}
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400/15 text-emerald-400">
          ✓
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-bold text-white">Batch open</p>
          <p className="text-[10px] text-white/40">3 seats left</p>
        </div>
      </div>
    </div>
  )
}

function StatsStrip() {
  const ref = useRef(null)
  const [go, setGo] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
      {STATS.map((s) => {
        const v = useCountUp(s.value, go)
        return (
          <div key={s.label} className="bg-[#080c1a] px-6 py-7 text-center">
            <p className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
              {v.toLocaleString()}
              <span className="text-cyan-400">{s.suffix}</span>
            </p>
            <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-white/40">
              {s.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [faqOpen, setFaqOpen] = useState(0)

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#070B18] font-sans text-white antialiased selection:bg-cyan-400/30">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-16px); }
        }
        @keyframes aurora {
          0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: .55; }
          33%      { transform: translate3d(6%, -8%, 0) scale(1.15); opacity: .75; }
          66%      { transform: translate3d(-6%, 6%, 0) scale(.92); opacity: .45; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        [data-reveal] {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1);
        }
        [data-reveal].is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
          * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      <Navbar />

      {/* ============================================================ */}
      {/* HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* aurora background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-indigo-600/35 blur-[120px]"
            style={{ animation: 'aurora 18s ease-in-out infinite' }}
          />
          <div
            className="absolute -top-20 right-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/25 blur-[120px]"
            style={{ animation: 'aurora 22s ease-in-out infinite reverse' }}
          />
          <div
            className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-emerald-500/20 blur-[120px]"
            style={{ animation: 'aurora 26s ease-in-out infinite' }}
          />
          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.14) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse 70% 60% at 50% 30%, #000 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 50% 30%, #000 40%, transparent 100%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* copy */}
            <div>
              <div
                data-reveal
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-white/70">
                  Admissions open · 2026 intake
                </span>
              </div>

              <h1
                data-reveal
                style={{ transitionDelay: '80ms' }}
                className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]"
              >
                Your seat at&nbsp;LLC is
                <br className="hidden sm:block" />{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    one form away.
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full text-cyan-400/50"
                    viewBox="0 0 300 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9C60 3 120 2 180 5c40 2 80 4 118 2"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p
                data-reveal
                style={{ transitionDelay: '160ms' }}
                className="mt-7 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
              >
                Browse courses, pick an open batch and register in under two
                minutes. Your account is created in the same step — then track
                your application status live from your dashboard.
              </p>

              <div
                data-reveal
                style={{ transitionDelay: '240ms' }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10">Start my registration</span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                  <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,.35)_50%,transparent_75%)] bg-[length:200%_100%] animate-[marquee_1.6s_linear_infinite]" />
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Browse courses
                </Link>
              </div>

              <ul
                data-reveal
                style={{ transitionDelay: '320ms' }}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-white/40"
              >
                {['No account needed to explore', 'Email verification', 'Live status tracking'].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      {t}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* visual */}
            <div data-reveal style={{ transitionDelay: '200ms' }} className="relative">
              <HeroCard />
            </div>
          </div>

          {/* stats */}
          <div data-reveal style={{ transitionDelay: '120ms' }} className="mt-20">
            <StatsStrip />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TICKER                                                       */}
      {/* ============================================================ */}
      <section className="relative border-y border-white/10 bg-white/[0.02] py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#070B18] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#070B18] to-transparent" />
        <div className="flex overflow-hidden">
          <div
            className="flex shrink-0 items-center gap-10 pr-10"
            style={{ animation: 'marquee 34s linear infinite' }}
          >
            {[...TICKER, ...TICKER].map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-white/30"
              >
                <span className="h-1 w-1 rounded-full bg-cyan-400/60" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COURSES                                                      */}
      {/* ============================================================ */}
      <section id="courses" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div data-reveal className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                The catalogue
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Only batches you can actually join
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/55">
                Closed batches never appear here, and the server re-checks
                availability the moment you submit. What you see is what you
                get.
              </p>
            </div>
            <Link
              data-reveal
              to="/courses"
              className="shrink-0 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
            >
              View all courses →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {COURSES.map((c, i) => (
              <article
                key={c.name}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.06]"
              >
                <div
                  className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${c.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-2xl">
                    {c.icon}
                  </span>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    {c.batches} open
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold tracking-tight text-white">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-white/45">{c.tagline}</p>

                <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <dt className="text-white/35">Duration</dt>
                    <dd className="font-semibold text-white/80">{c.duration}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="shrink-0 text-white/35">Schedule</dt>
                    <dd className="text-right font-semibold text-white/80">
                      {c.schedule}
                    </dd>
                  </div>
                </dl>

                <Link
                  to="/courses"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 transition group-hover:gap-2.5"
                >
                  View batches <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section
        id="how-it-works"
        className="relative border-y border-white/10 bg-white/[0.02] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Four steps. Zero office visits.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              The whole journey is designed around a single idea: you should
              never wonder whether your application went through.
            </p>
          </div>

          <div className="relative mt-16">
            {/* connector */}
            <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  data-reveal
                  style={{ transitionDelay: `${i * 110}ms` }}
                  className="relative"
                >
                  <div className="relative z-10 inline-grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl border border-white/12 bg-[#0b1020] text-xl font-black text-transparent shadow-xl">
                    <span className="bg-gradient-to-br from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES BENTO                                               */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              Built properly
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              The engineering nobody notices — until it saves them
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 transition-all duration-300 hover:border-white/25 hover:from-white/[0.09] ${f.span}`}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                <span className="inline-grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-lg">
                  {f.icon}
                </span>
                <h3 className="mt-5 text-base font-bold tracking-tight text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STATUS PIPELINE (dark feature block)                         */}
      {/* ============================================================ */}
      <section id="status" className="relative overflow-hidden py-24 sm:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                Live status
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                You always know exactly where you stand
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55">
                Every registration moves through a defined set of states, and
                every change is recorded with a timestamp. No phone calls, no
                guessing.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'REJECTED', 'CANCELLED'].map(
                  (s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-white/60"
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            </div>

            <div data-reveal style={{ transitionDelay: '140ms' }} className="space-y-4">
              {STATUSES.map((s, i) => {
                const tone = {
                  indigo: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300',
                  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
                  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
                }[s.tone]

                return (
                  <div
                    key={s.key}
                    className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-black ${tone}`}
                      >
                        {i + 1}
                      </span>
                      {i < STATUSES.length - 1 && (
                        <span className="mt-1 h-6 w-px bg-white/15" />
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold tracking-tight text-white">
                        {s.key}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-white/50">
                        {s.body}
                      </p>
                    </div>
                  </div>
                )
              })}
              <p className="pl-1 text-xs text-white/30">
                REJECTED and CANCELLED are terminal states and are also logged in
                full history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <section className="border-y border-white/10 bg-white/[0.02] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              Voices
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              From the people who used it
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-7 transition hover:border-white/25"
              >
                <blockquote className="text-[15px] leading-relaxed text-white/70">
                  <span className="mr-1 text-2xl leading-none text-cyan-400">“</span>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-[#070B18]">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[12px] text-white/40">{t.meta}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ                                                          */}
      {/* ============================================================ */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div data-reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              Questions
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Everything you might ask
            </h2>
          </div>

          <div className="mt-12 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            {FAQS.map((f, i) => {
              const open = faqOpen === i
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setFaqOpen(open ? -1 : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-white/[0.03]"
                  >
                    <span className="text-[15px] font-semibold text-white/90">
                      {f.q}
                    </span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-sm transition-transform duration-300 ${
                        open ? 'rotate-45 border-cyan-400/50 text-cyan-400' : 'text-white/50'
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 pr-14 text-sm leading-relaxed text-white/50">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA                                                    */}
      {/* ============================================================ */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <div
          data-reveal
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-indigo-600/25 via-[#0b1020] to-emerald-600/20 px-6 py-16 text-center sm:px-14 sm:py-24"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/25 blur-[90px]" />
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-emerald-500/25 blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                maskImage:
                  'radial-gradient(ellipse 60% 70% at 50% 50%, #000 30%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 60% 70% at 50% 50%, #000 30%, transparent 100%)',
              }}
            />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              The next batch fills up.
              <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {' '}
                Take your seat.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
              Registration takes about two minutes. You will receive a unique
              reference number the moment you submit.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#070B18] shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:shadow-black/50"
              >
                Apply now <span>→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:bg-white/5"
              >
                I already registered
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 bg-[#05080f]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-sm font-black text-[#04060f]">
                  LLC
                </span>
                <span className="text-sm font-bold text-white">
                  Language Learning Campus
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
                Kalmunai, Sri Lanka. Practical language education with a
                registration process that respects your time.
              </p>
            </div>

            {[
              {
                title: 'Explore',
                links: [
                  { label: 'Courses', to: '/courses' },
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'FAQ', href: '#faq' },
                ],
              },
              {
                title: 'Students',
                links: [
                  { label: 'Register', to: '/register' },
                  { label: 'Sign in', to: '/login' },
                  { label: 'Forgot password', to: '/forgot-password' },
                ],
              },
              {
                title: 'Contact',
                links: [
                  { label: 'hello@llc.lk', href: 'mailto:hello@llc.lk' },
                  { label: '+94 77 000 0000', href: 'tel:+94770000000' },
                  { label: 'Kalmunai, LK', href: '#' },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link
                          to={l.to}
                          className="text-sm text-white/55 transition hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="text-sm text-white/55 transition hover:text-white"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Language Learning Campus. All rights
              reserved.
            </p>
            <p className="text-xs text-white/30">
              Built with Node.js · Express · MySQL · React
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}