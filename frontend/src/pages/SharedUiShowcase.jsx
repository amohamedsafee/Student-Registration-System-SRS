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
} from 'lucide-react';

export default function SharedUiShowcase() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('md');

  // Input states
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [inputError, setInputError] = useState('');

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
    <div className="min-h-screen bg-[#070B18] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Day 3 Deliverable: Shared UI & API Client Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Design System & Shared Components
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            A comprehensive, battle-tested UI kit for the Language Learning Campus (LLC) Student Registration System.
          </p>
        </section>

        {/* 1. BUTTONS SECTION */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layers className="text-cyan-400" size={20} />
                <span>1. Button Component</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Variants, sizes, loading spinners, leading/trailing icons, and micro-press physics.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBtnLoading(!btnLoading)}
              iconLeading={<RefreshCw size={14} className={btnLoading ? 'animate-spin' : ''} />}
            >
              Toggle Loading State ({btnLoading ? 'ON' : 'OFF'})
            </Button>
          </div>

          {/* Variants Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Style Variants
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading={btnLoading} id="showcase-btn-primary">
                Primary Gradient
              </Button>
              <Button variant="secondary" isLoading={btnLoading} id="showcase-btn-secondary">
                Secondary Glass
              </Button>
              <Button variant="outline" isLoading={btnLoading} id="showcase-btn-outline">
                Outline
              </Button>
              <Button variant="ghost" isLoading={btnLoading} id="showcase-btn-ghost">
                Ghost
              </Button>
              <Button variant="danger" isLoading={btnLoading} id="showcase-btn-danger">
                Danger / Reject
              </Button>
              <Button variant="success" isLoading={btnLoading} id="showcase-btn-success">
                Success / Confirm
              </Button>
              <Button variant="primary" disabled id="showcase-btn-disabled">
                Disabled
              </Button>
            </div>
          </div>

          {/* Sizes Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sizes & Icon Support
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary" iconLeading={<Sparkles size={14} />}>
                Small Action
              </Button>
              <Button size="md" variant="secondary" iconTrailing={<Send size={15} />}>
                Medium Default
              </Button>
              <Button size="lg" variant="primary" iconTrailing={<CheckCircle size={18} />}>
                Large Call To Action
              </Button>
            </div>
          </div>
        </section>

        {/* 2. FORM CONTROLS: INPUT & SELECT */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="text-emerald-400" size={20} />
              <span>2. Form Inputs & Select Dropdowns</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accessible form controls with custom icons, password toggles, floating errors, and hint text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Standard Text Input */}
            <Input
              id="showcase-full-name"
              label="Full Name"
              required
              placeholder="e.g. A. Mohamed Safee"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              iconLeading={<User size={16} />}
              hint="Enter name as it should appear on your certificate"
            />

            {/* Email Input */}
            <Input
              id="showcase-email"
              type="email"
              label="Email Address"
              required
              placeholder="student@example.com"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              iconLeading={<Mail size={16} />}
              hint="We will send your verification code here"
            />

            {/* Password Input with Toggle */}
            <Input
              id="showcase-password"
              type="password"
              label="Student Password"
              required
              placeholder="Enter secure password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              iconLeading={<Lock size={16} />}
              hint="Click eye icon to toggle visibility"
            />

            {/* Course Select Dropdown */}
            <Select
              id="showcase-course-select"
              label="Select Desired Course"
              required
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={sampleCourseOptions}
              placeholder="Choose a language course..."
              hint="Open batches will be filtered automatically"
            />

            {/* Simulated Error State Input */}
            <Input
              id="showcase-error-input"
              label="Input with Error Validation"
              value={inputError}
              onChange={(e) => setInputError(e.target.value)}
              placeholder="Type to test error appearance..."
              error="Phone number must be a valid 10-digit Sri Lankan mobile number (e.g. 0771234567)"
            />

            {/* Disabled Input */}
            <Input
              id="showcase-disabled-input"
              label="Disabled / Read-Only Field"
              value="LLC-2026-000001 (Auto-generated)"
              disabled
              hint="Unique registration number assigned upon submit"
            />
          </div>
        </section>

        {/* 3. STATUS BADGES SECTION */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="text-indigo-400" size={20} />
              <span>3. StatusBadge Component</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pre-calibrated semantic badges for all 5 core registration states in `database-design.md`.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Core Registration Workflow States
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={REGISTRATION_STATUSES.PENDING} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.UNDER_REVIEW} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.CONFIRMED} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.REJECTED} size="lg" />
              <StatusBadge status={REGISTRATION_STATUSES.CANCELLED} size="lg" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Batch & Catalog State Badges (Compact & Standard)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="OPEN" size="md" />
              <StatusBadge status="CLOSED" size="md" />
              <StatusBadge status="ACTIVE" size="sm" />
              <StatusBadge status="INACTIVE" size="sm" />
            </div>
          </div>
        </section>

        {/* 4. MODAL & SPINNER SECTION */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>4. Modal Dialog & Spinners</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Backdrop blurred modal with escape keyboard listener and varied spinner sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Modal Launchers */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Interactive Modal Demo
              </h3>
              <p className="text-xs text-slate-300">
                Click below to test the accessible modal dialog with backdrop blur, scroll locking, and smooth closing:
              </p>
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
                  Open Small Modal
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
                  Open Default Modal
                </Button>
                <Button
                  id="open-modal-lg"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setModalSize('lg');
                    setIsModalOpen(true);
                  }}
                >
                  Open Large Modal
                </Button>
              </div>
            </div>

            {/* Spinner Sizes */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Animated Spinners
              </h3>
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="xs" variant="muted" />
                  <span className="text-[10px] text-slate-400">XS</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" variant="white" />
                  <span className="text-[10px] text-slate-400">SM</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" variant="cyan" />
                  <span className="text-[10px] text-slate-400">MD</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" variant="primary" />
                  <span className="text-[10px] text-slate-400">LG</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="xl" variant="emerald" />
                  <span className="text-[10px] text-slate-400">XL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. AXIOS CLIENT LIVE TEST */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Server className="text-cyan-400" size={20} />
                <span>5. Axios API Client Live Connectivity</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tests `apiClient.get('/health')` with credentials and standard error interceptors.
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
              Ping API Health (/api/health)
            </Button>
          </div>

          <div className="rounded-2xl bg-[#050811] border border-white/10 p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400">
              <span>Endpoint: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/health</span>
              <span className="text-[11px] text-indigo-400">withCredentials: true</span>
            </div>

            <div className="pt-4">
              {apiLoading ? (
                <div className="flex items-center gap-3 text-slate-400 py-3">
                  <Spinner size="sm" variant="cyan" />
                  <span>Connecting to Express backend server...</span>
                </div>
              ) : apiResponse ? (
                <div className="space-y-2 text-emerald-400">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle size={15} />
                    <span>HTTP 200 OK — Backend Connected!</span>
                  </div>
                  <pre className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 overflow-x-auto text-emerald-300">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              ) : apiError ? (
                <div className="space-y-2 text-rose-400">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle size={15} />
                    <span>Connection Result:</span>
                  </div>
                  <pre className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/20 overflow-x-auto text-rose-300">
                    {apiError}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    Tip: Start the backend server (`npm run backend` or `npm start` in backend) to test live ping.
                  </p>
                </div>
              ) : (
                <div className="text-slate-500 py-2">
                  Click the "Ping API Health" button above to execute a live request through Axios.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Reusable Modal Dialog Instance */}
      <Modal
        id="demo-modal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={modalSize}
        title="Student Registration Confirmation"
        description="Language Learning Campus (LLC) Admissions"
        footer={
          <>
            <Button
              id="modal-cancel-btn"
              variant="ghost"
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
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Assigned Number:</span>
              <span className="font-mono text-cyan-400 font-bold">LLC-2026-000001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Status:</span>
              <StatusBadge status={REGISTRATION_STATUSES.PENDING} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Selected Program:</span>
              <span className="text-xs text-white font-medium">Diploma in English (Batch 2026-A)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upon submitting this registration, a single atomic MySQL transaction verifies batch availability, records your student profile, and issues your official tracking number.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
