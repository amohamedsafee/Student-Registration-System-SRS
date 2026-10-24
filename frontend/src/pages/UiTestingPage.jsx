import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Button,
  Input,
  Select,
  Modal,
  Spinner,
  StatusBadge,
} from '../components/ui';
import apiClient from '../core/api/apiClient';
import { REGISTRATION_STATUSES } from '../core/constants';
import {
  Sparkles,
  Send,
  Lock,
  Mail,
  User,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Layers,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function UiTestingPage() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('md');

  // Input states
  const [testName, setTestName] = useState('A. Mohamed Safee');
  const [testEmail, setTestEmail] = useState('student@llc.lk');
  const [testPassword, setTestPassword] = useState('Password123!');
  const [testCourse, setTestCourse] = useState('dip-eng');
  const [testPhone, setTestPhone] = useState('0771234567');
  const [testError, setTestError] = useState('Invalid Sri Lankan phone number format');

  // Button loading toggle state
  const [btnLoading, setBtnLoading] = useState(false);

  // Live API test state
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Test live Axios call
  const handleTestApi = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiResponse(null);
    try {
      const data = await apiClient.get('/health');
      setApiResponse(data);
    } catch (err) {
      setApiError(err.message || 'API connection failed');
    } finally {
      setApiLoading(false);
    }
  };

  const sampleCourseOptions = [
    { value: 'dip-eng', label: 'Diploma in English & Communication Skills (6 Months)' },
    { value: 'spoken-eng', label: 'Spoken English & Fluency Workshop (3 Months)' },
    { value: 'ielts', label: 'IELTS Academic Masterclass (2 Months)' },
    { value: 'sinhala', label: 'Sinhala for Everyday Communication (3 Months)' },
    { value: 'tamil', label: 'Tamil Language for Beginners (3 Months)' },
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-12 space-y-16">
        {/* ===================== HERO / HEADER ===================== */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="eyebrow">
            UI Consistency & Quality Assurance Lab
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-[#182B5E]">
            Design System <em>Component Testing</em> Suite
          </h1>
          <p className="text-lg text-[#5A6B8C] font-semibold max-w-2xl mx-auto">
            Strictly verifying visual fidelity, neo-brutalist sharp geometry, hard drop shadows, and responsive interaction patterns from <code>sample.jsx</code>.
          </p>
        </section>

        {/* ===================== 1. COLOR TOKENS ===================== */}
        <section className="brutal-card-flat space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3 flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E]">
              1. Brand Color & Token Palette
            </h2>
            <span className="text-xs font-black uppercase text-[#5A6B8C]">Exact Tokens</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="border-2 border-[#182B5E] p-4 bg-[#182B5E] text-white">
              <span className="block font-black text-sm">--navy</span>
              <span className="text-xs font-mono">#182B5E</span>
            </div>
            <div className="border-2 border-[#182B5E] p-4 bg-[#2A427D] text-white">
              <span className="block font-black text-sm">--navy-light</span>
              <span className="text-xs font-mono">#2A427D</span>
            </div>
            <div className="border-2 border-[#182B5E] p-4 bg-[#D9381E] text-white">
              <span className="block font-black text-sm">--red</span>
              <span className="text-xs font-mono">#D9381E</span>
            </div>
            <div className="border-2 border-[#182B5E] p-4 bg-[#116530] text-white">
              <span className="block font-black text-sm">--green</span>
              <span className="text-xs font-mono">#116530</span>
            </div>
            <div className="border-2 border-[#182B5E] p-4 bg-[#F28C28] text-[#182B5E]">
              <span className="block font-black text-sm">--orange</span>
              <span className="text-xs font-mono">#F28C28</span>
            </div>
            <div className="border-2 border-[#182B5E] p-4 bg-[#F7F9FC] text-[#182B5E]">
              <span className="block font-black text-sm">--bg</span>
              <span className="text-xs font-mono">#F7F9FC</span>
            </div>
          </div>
        </section>

        {/* ===================== 2. BUTTONS ===================== */}
        <section className="brutal-card space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E] flex items-center gap-2">
                <Layers size={20} className="text-[#D9381E]" />
                <span>2. Neo-Brutalist Buttons</span>
              </h2>
              <p className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
                Sharp borders, hard shadows on hover, uppercase tracking, and physics translation.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBtnLoading(!btnLoading)}
              iconLeading={<RefreshCw size={14} className={btnLoading ? 'animate-spin' : ''} />}
            >
              Toggle Loading ({btnLoading ? 'ACTIVE' : 'OFF'})
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
              Interactive Button Variants
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" isLoading={btnLoading} id="btn-primary-test">
                Primary Solid
              </Button>
              <Button variant="secondary" isLoading={btnLoading} id="btn-secondary-test">
                Secondary Transparent
              </Button>
              <Button variant="sm-solid" isLoading={btnLoading} id="btn-sm-solid-test">
                Compact Solid
              </Button>
              <Button variant="danger" isLoading={btnLoading} id="btn-danger-test">
                Danger Red
              </Button>
              <Button variant="success" isLoading={btnLoading} id="btn-success-test">
                Success Green
              </Button>
              <Button variant="warning" isLoading={btnLoading} id="btn-warning-test">
                Warning Orange
              </Button>
              <Button variant="ghost" isLoading={btnLoading} id="btn-ghost-test">
                Ghost Link
              </Button>
              <Button variant="primary" disabled id="btn-disabled-test">
                Disabled
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#CBD5E1]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
              Sizes & Icon Support
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary" iconLeading={<Sparkles size={14} />}>
                Small Action
              </Button>
              <Button size="md" variant="primary" iconTrailing={<Send size={15} />}>
                Medium Default
              </Button>
              <Button size="lg" variant="primary" iconTrailing={<CheckCircle size={18} />}>
                Large Call To Action
              </Button>
            </div>
          </div>
        </section>

        {/* ===================== 3. FORM INPUTS & SELECT ===================== */}
        <section className="brutal-card space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E] flex items-center gap-2">
              <User size={20} className="text-[#116530]" />
              <span>3. Form Controls (Input & Select)</span>
            </h2>
            <p className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
              White background, 2px navy borders, uppercase labels, and hard shadow focus states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              id="test-full-name"
              label="Full Name"
              required
              placeholder="e.g. A. Mohamed Safee"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              iconLeading={<User size={16} />}
              hint="Name as it will appear on your certificate"
            />

            <Input
              id="test-email"
              type="email"
              label="Student Email Address"
              required
              placeholder="student@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              iconLeading={<Mail size={16} />}
              hint="Official correspondence will be sent here"
            />

            <Input
              id="test-password"
              type="password"
              label="Portal Password"
              required
              placeholder="Enter secure password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              iconLeading={<Lock size={16} />}
              hint="Click eye icon to toggle visibility"
            />

            <Select
              id="test-course-select"
              label="Course Selection"
              required
              value={testCourse}
              onChange={(e) => setTestCourse(e.target.value)}
              options={sampleCourseOptions}
              hint="Filter and select your intake"
            />

            <Input
              id="test-error-input"
              label="Input with Error Validation"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              error={testError}
              iconLeading={<Phone size={16} />}
            />

            <Input
              id="test-disabled-input"
              label="Read-Only Auto Field"
              value="LLC-2026-000001 (Server Assigned)"
              disabled
              hint="Automatically assigned upon registration"
            />
          </div>
        </section>

        {/* ===================== 4. STATUS BADGES ===================== */}
        <section className="brutal-card-flat space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E] flex items-center gap-2">
              <CheckCircle size={20} className="text-[#F28C28]" />
              <span>4. Status Badges</span>
            </h2>
            <p className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
              Exact badge classes from sample.jsx (sharp 2px navy borders, uppercase text).
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
              Registration Status Workflow
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge status={REGISTRATION_STATUSES.PENDING} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.UNDER_REVIEW} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.CONFIRMED} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.REJECTED} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.CANCELLED} size="lg" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#CBD5E1]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
              Batch & Catalog Statuses
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge status="OPEN" size="md" />
              <StatusBadge status="CLOSED" size="md" />
              <StatusBadge status="ACTIVE" size="sm" />
              <StatusBadge status="INACTIVE" size="sm" />
            </div>
          </div>
        </section>

        {/* ===================== 5. CARDS & BENTO STYLING ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E] flex items-center gap-2">
              <BookOpen size={20} className="text-[#D9381E]" />
              <span>5. Neo-Brutalist Course & Hero Cards</span>
            </h2>
            <p className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
              Top colored stripes, dt/dd metadata rows, and 8px hard drop shadows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Red Stripe Course Card */}
            <div className="bg-white border-[3px] border-[#182B5E] p-6 relative hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#182B5E] transition-all duration-200">
              <div className="h-2 bg-[#D9381E] absolute -top-[3px] -left-[3px] -right-[3px]" />
              <div className="flex justify-between items-start mt-2 mb-4">
                <div className="w-10 h-10 border-2 border-[#182B5E] bg-[#F1F5F9] flex items-center justify-center font-black">
                  EN
                </div>
                <StatusBadge status="OPEN" size="sm" />
              </div>
              <h3 className="text-xl font-black text-[#182B5E]">Diploma in English</h3>
              <p className="text-xs text-[#5A6B8C] font-semibold mt-2">
                Grammar, vocabulary, and professional public speaking.
              </p>
              <dl className="mt-4 pt-4 border-t-2 border-[#182B5E] space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-[#5A6B8C] font-bold">Duration</dt>
                  <dd className="text-[#182B5E] font-black">6 Months</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5A6B8C] font-bold">Next Batch</dt>
                  <dd className="text-[#182B5E] font-black">Weekend Morning</dd>
                </div>
              </dl>
              <div className="mt-6 pt-4 border-t border-[#CBD5E1]">
                <Button variant="primary" size="sm" className="w-full" iconTrailing={<ArrowRight size={14} />}>
                  Select Course
                </Button>
              </div>
            </div>

            {/* Green Stripe Course Card */}
            <div className="bg-white border-[3px] border-[#182B5E] p-6 relative hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#182B5E] transition-all duration-200">
              <div className="h-2 bg-[#116530] absolute -top-[3px] -left-[3px] -right-[3px]" />
              <div className="flex justify-between items-start mt-2 mb-4">
                <div className="w-10 h-10 border-2 border-[#182B5E] bg-[#F1F5F9] flex items-center justify-center font-black">
                  SP
                </div>
                <StatusBadge status="OPEN" size="sm" />
              </div>
              <h3 className="text-xl font-black text-[#182B5E]">Spoken English</h3>
              <p className="text-xs text-[#5A6B8C] font-semibold mt-2">
                Daily conversation drills and pronunciation fluency.
              </p>
              <dl className="mt-4 pt-4 border-t-2 border-[#182B5E] space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-[#5A6B8C] font-bold">Duration</dt>
                  <dd className="text-[#182B5E] font-black">3 Months</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5A6B8C] font-bold">Next Batch</dt>
                  <dd className="text-[#182B5E] font-black">Weekday Evening</dd>
                </div>
              </dl>
              <div className="mt-6 pt-4 border-t border-[#CBD5E1]">
                <Button variant="primary" size="sm" className="w-full" iconTrailing={<ArrowRight size={14} />}>
                  Select Course
                </Button>
              </div>
            </div>

            {/* Orange Stripe Course Card */}
            <div className="bg-white border-[3px] border-[#182B5E] p-6 relative hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#182B5E] transition-all duration-200">
              <div className="h-2 bg-[#F28C28] absolute -top-[3px] -left-[3px] -right-[3px]" />
              <div className="flex justify-between items-start mt-2 mb-4">
                <div className="w-10 h-10 border-2 border-[#182B5E] bg-[#F1F5F9] flex items-center justify-center font-black">
                  IE
                </div>
                <StatusBadge status="OPEN" size="sm" />
              </div>
              <h3 className="text-xl font-black text-[#182B5E]">IELTS Masterclass</h3>
              <p className="text-xs text-[#5A6B8C] font-semibold mt-2">
                Intensive preparation targeting Academic Band 7.0+.
              </p>
              <dl className="mt-4 pt-4 border-t-2 border-[#182B5E] space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-[#5A6B8C] font-bold">Duration</dt>
                  <dd className="text-[#182B5E] font-black">2 Months</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5A6B8C] font-bold">Next Batch</dt>
                  <dd className="text-[#182B5E] font-black">Fast Track (Mon-Thu)</dd>
                </div>
              </dl>
              <div className="mt-6 pt-4 border-t border-[#CBD5E1]">
                <Button variant="primary" size="sm" className="w-full" iconTrailing={<ArrowRight size={14} />}>
                  Select Course
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6. MODAL & SPINNERS ===================== */}
        <section className="brutal-card space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E] flex items-center gap-2">
              <Sparkles size={20} className="text-[#F28C28]" />
              <span>6. Modal Dialog & Spinners</span>
            </h2>
            <p className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
              Sharp brutalist modal with 3px navy border, 12px hard drop shadow, and responsive backdrop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
                Interactive Modal Demo
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  id="open-modal-sm"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setModalSize('sm');
                    setIsModalOpen(true);
                  }}
                >
                  Small Modal
                </Button>
                <Button
                  id="open-modal-md"
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setModalSize('md');
                    setIsModalOpen(true);
                  }}
                >
                  Default Modal (MD)
                </Button>
                <Button
                  id="open-modal-lg"
                  variant="warning"
                  size="md"
                  onClick={() => {
                    setModalSize('lg');
                    setIsModalOpen(true);
                  }}
                >
                  Large Modal (LG)
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
                Spinners in Theme Colors
              </h3>
              <div className="flex items-center gap-6 p-4 border-2 border-[#182B5E] bg-white">
                <div className="flex flex-col items-center gap-1">
                  <Spinner size="xs" variant="navy" />
                  <span className="text-[10px] font-bold">XS</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Spinner size="sm" variant="red" />
                  <span className="text-[10px] font-bold">SM</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Spinner size="md" variant="navy" />
                  <span className="text-[10px] font-bold">MD</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Spinner size="lg" variant="green" />
                  <span className="text-[10px] font-bold">LG</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Spinner size="xl" variant="orange" />
                  <span className="text-[10px] font-bold">XL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7. LIVE AXIOS CLIENT CONNECTIVITY ===================== */}
        <section className="brutal-card-flat space-y-6">
          <div className="border-b-2 border-[#182B5E] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E] flex items-center gap-2">
                <Server size={20} className="text-[#182B5E]" />
                <span>7. Axios API Client Live Connectivity</span>
              </h2>
              <p className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
                Pings Express server <code>GET /api/health</code> using credentials and standardized error handlers.
              </p>
            </div>
            <Button
              id="test-api-button"
              variant="primary"
              size="sm"
              onClick={handleTestApi}
              isLoading={apiLoading}
              iconLeading={<Server size={14} />}
            >
              Ping /api/health
            </Button>
          </div>

          <div className="border-2 border-[#182B5E] bg-white p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#182B5E] font-bold">
              <span>Endpoint: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/health</span>
              <span className="text-[#116530]">withCredentials: true</span>
            </div>

            <div className="pt-4">
              {apiLoading ? (
                <div className="flex items-center gap-3 py-2 text-[#182B5E]">
                  <Spinner size="sm" variant="navy" />
                  <span>Connecting to Express API server...</span>
                </div>
              ) : apiResponse ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-black text-[#116530]">
                    <CheckCircle size={16} />
                    <span>HTTP 200 OK — Connection Verified!</span>
                  </div>
                  <pre className="bg-[#F7F9FC] border-2 border-[#116530] p-3 text-[#182B5E] overflow-x-auto font-bold">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              ) : apiError ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-black text-[#D9381E]">
                    <AlertTriangle size={16} />
                    <span>Connection Status:</span>
                  </div>
                  <pre className="bg-[#F7F9FC] border-2 border-[#D9381E] p-3 text-[#D9381E] overflow-x-auto font-bold">
                    {apiError}
                  </pre>
                  <p className="text-[11px] text-[#5A6B8C] font-sans font-bold">
                    Tip: Start backend with <code>npm run backend</code> in a terminal.
                  </p>
                </div>
              ) : (
                <div className="text-[#5A6B8C] py-2 font-sans font-semibold">
                  Click the "Ping /api/health" button to test live Axios communication.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 7: Complete Application Pages Directory (Days 11 - 22) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-[#182B5E]">
            <span className="font-mono text-xs font-black bg-[#182B5E] text-white px-2 py-0.5">
              07
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#182B5E]">
              System Views & Portals Directory (Days 11 – 22)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Registration */}
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-3">
              <span className="eyebrow">Days 11 - 13</span>
              <h3 className="text-lg font-black text-[#182B5E]">Direct Intake Registration</h3>
              <p className="text-xs font-semibold text-[#5A6B8C]">
                Single atomic transaction form: account credentials, student dossier, course selection, and receipt.
              </p>
              <a href="/register" className="btn-sm-solid inline-flex items-center gap-2 mt-2">
                Open Registration Form <ArrowRight size={14} />
              </a>
            </div>

            {/* Student Dashboard */}
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-3">
              <span className="eyebrow">Days 14 - 15</span>
              <h3 className="text-lg font-black text-[#182B5E]">Student Dashboard</h3>
              <p className="text-xs font-semibold text-[#5A6B8C]">
                Personal dossier, own course registrations, status timeline tracking, cancellation, and extra enrollments.
              </p>
              <a href="/dashboard" className="btn-sm-solid inline-flex items-center gap-2 mt-2">
                Open Student Dashboard <ArrowRight size={14} />
              </a>
            </div>

            {/* Admin Overview */}
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-3">
              <span className="eyebrow">Days 16 - 21</span>
              <h3 className="text-lg font-black text-[#182B5E]">Admin Executive Console</h3>
              <p className="text-xs font-semibold text-[#5A6B8C]">
                Intake metrics, course & batch controllers, registration review dossier, status modification, and safe CSV export.
              </p>
              <a href="/admin" className="btn-sm-solid inline-flex items-center gap-2 mt-2">
                Open Admin Portal <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Dialog Instance */}
      <Modal
        id="demo-modal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={modalSize}
        title="Student Registration Confirmation"
        description="Language Learning Campus (LLC) Admissions Engine"
        footer={
          <>
            <Button
              id="modal-cancel-btn"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="modal-confirm-btn"
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              iconLeading={<CheckCircle size={14} />}
            >
              Acknowledge & Proceed
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 border-2 border-[#182B5E] bg-[#F7F9FC] space-y-2 font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5A6B8C] font-black">Registration ID:</span>
              <span className="font-mono text-[#182B5E] font-black">LLC-2026-000001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5A6B8C] font-black">Status:</span>
              <StatusBadge status={REGISTRATION_STATUSES.PENDING} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5A6B8C] font-black">Selected Batch:</span>
              <span className="text-xs text-[#182B5E] font-black">Diploma in English (Batch 2026-A)</span>
            </div>
          </div>
          <p className="text-xs text-[#5A6B8C] font-medium leading-relaxed">
            Upon submitting this registration, a single atomic MySQL transaction verifies batch availability, records your student profile, and issues your official tracking number.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
