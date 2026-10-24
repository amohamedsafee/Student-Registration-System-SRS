import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-screen bg-[#070B18] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
        <span className="text-4xl">🔐</span>
        <h1 className="mt-4 text-2xl font-bold">Sign In</h1>
        <p className="mt-2 text-sm text-white/60">
          Student & Admin sign-in portal.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
