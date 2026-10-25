import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input, Select, StatusBadge, Spinner } from '../components/ui';
import courseApi from '../features/courses/api/courseApi';
import registrationApi from '../features/registration/api/registrationApi';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  Printer,
  Calendar,
} from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialCourse = searchParams.get('course') || '';
  const initialBatch = searchParams.get('batch') || '';

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    address: '',
    dob: '',
    gender: 'male',
    courseId: initialCourse,
    batchId: initialBatch,
  });

  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignedNumber, setAssignedNumber] = useState('');
  const [copied, setCopied] = useState(false);

  // Load active courses from backend
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingCatalog(true);
        const data = await courseApi.getCourses();
        setCourses(data);

        // Pre-select course if specified, or first course
        const targetCourseId = initialCourse || (data.length > 0 ? data[0].id : '');
        if (targetCourseId) {
          setFormData((prev) => ({ ...prev, courseId: targetCourseId }));
          // Fetch open batches for this course
          const openBatches = await courseApi.getCourseBatches(targetCourseId);
          setBatches(openBatches);
          if (initialBatch && openBatches.some((b) => b.id === initialBatch)) {
            setFormData((prev) => ({ ...prev, batchId: initialBatch }));
          } else if (openBatches.length > 0) {
            setFormData((prev) => ({ ...prev, batchId: openBatches[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to load courses for registration:', err);
      } finally {
        setLoadingCatalog(false);
      }
    }

    loadCatalog();
  }, [initialCourse, initialBatch]);

  // Handle course change: reload batches
  const handleCourseChange = async (newCourseId) => {
    setFormData((prev) => ({ ...prev, courseId: newCourseId, batchId: '' }));
    try {
      const openBatches = await courseApi.getCourseBatches(newCourseId);
      setBatches(openBatches);
      if (openBatches.length > 0) {
        setFormData((prev) => ({ ...prev, batchId: openBatches[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch batches for course:', err);
    }
  };

  const validateClientForm = () => {
    const errors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Valid email address is required.';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    const phoneRegex = /^(?:(?:\+|00)94|0)?7[0-9]{8}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Valid Sri Lankan mobile number required (e.g. 0771234567).';
    }

    if (!formData.batchId) {
      errors.batchId = 'Please select an open batch.';
    }

    if (formData.dob) {
      const selected = new Date(formData.dob);
      const today = new Date();
      if (selected > today) {
        errors.dob = 'Date of birth cannot be in the future.';
      }
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateClientForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone_number: formData.phone.trim(),
        whatsapp_number: formData.whatsapp.trim() || null,
        home_address: formData.address.trim() || null,
        date_of_birth: formData.dob || null,
        gender: formData.gender || null,
        batch_id: formData.batchId,
      };

      const response = await registrationApi.apply(payload);
      setAssignedNumber(response.registration_number);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.details && typeof err.details === 'object') {
        setClientErrors(err.details);
        const detailedList = Object.entries(err.details)
          .map(([field, msg]) => `${field.replace(/_/g, ' ')}: ${msg}`)
          .join('; ');
        setServerError(err.message ? `${err.message}: ${detailedList}` : detailedList);
      } else {
        setServerError(
          err.message || 'Registration failed. Please check your inputs and try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (assignedNumber) {
      navigator.clipboard.writeText(assignedNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId);
  const selectedBatchObj = batches.find((b) => b.id === formData.batchId);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-10 sm:py-12">
        {!submitted ? (
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="eyebrow">
              Direct Student Intake · 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#182B5E]">
              One Form. <em>Instant Seat</em>.
            </h1>
            <p className="text-base text-[#5A6B8C] font-semibold">
              Select your course and batch. An account and your tracking number are generated in one atomic step.
            </p>
          </div>
        ) : (
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="eyebrow-green">
              Application Confirmed · 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-[#182B5E]">
              Admission <em>Receipt & Tracking</em>
            </h1>
            <p className="text-sm sm:text-base text-[#5A6B8C] font-semibold">
              Your registration has been securely processed. Keep your tracking number safe.
            </p>
          </div>
        )}

        {submitted ? (
          /* Day 13 Confirmation Receipt */
          <div className="max-w-2xl mx-auto bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 sm:p-12 space-y-8">
            <div className="text-center space-y-4">
              <div
                className="w-16 h-16 flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: '#116530',
                  border: '3px solid #182B5E',
                  boxShadow: '4px 4px 0px 0px #182B5E',
                  color: '#FFFFFF'
                }}
              >
                <CheckCircle size={36} color="#FFFFFF" strokeWidth={2.5} />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#116530] bg-[#DCFCE7] px-3 py-1 border border-[#116530]">
                  Application Confirmed
                </span>
                <h2 className="text-3xl font-black text-[#182B5E] mt-3">
                  Registration Successfully Submitted
                </h2>
                <p className="text-sm font-semibold text-[#5A6B8C] mt-1">
                  Keep your registration number safe. You will need it for admission inquiries and payments.
                </p>
              </div>
            </div>

            {/* Registration Number Display Box */}
            <div className="border-[3px] border-[#182B5E] bg-[#F7F9FC] p-6 shadow-[4px_4px_0px_0px_#182B5E] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-[#182B5E]">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
                    Registration Reference Number
                  </span>
                  <div className="font-mono text-3xl font-black text-[#182B5E] tracking-tight">
                    {assignedNumber}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  iconLeading={copied ? <Check size={16} /> : <Copy size={16} />}
                >
                  {copied ? 'Copied!' : 'Copy Number'}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-[#5A6B8C] block uppercase">Student Name:</span>
                  <span className="font-black text-[#182B5E] text-sm">{formData.fullName}</span>
                </div>
                <div>
                  <span className="font-bold text-[#5A6B8C] block uppercase">Registered Email:</span>
                  <span className="font-black text-[#182B5E] text-sm">{formData.email}</span>
                </div>
                <div>
                  <span className="font-bold text-[#5A6B8C] block uppercase">Selected Course:</span>
                  <span className="font-black text-[#182B5E] text-sm">{selectedCourseObj?.name || 'Selected Course'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#5A6B8C] block uppercase">Batch & Schedule:</span>
                  <span className="font-black text-[#182B5E] text-sm">{selectedBatchObj?.batch_name || 'Assigned Batch'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#5A6B8C] block uppercase">Initial Status:</span>
                  <StatusBadge status="PENDING" size="sm" />
                </div>
                <div>
                  <span className="font-bold text-[#5A6B8C] block uppercase">Intake Year:</span>
                  <span className="font-black text-[#182B5E] text-sm">2026 Academic Cycle</span>
                </div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="border-l-4 border-[#182B5E] bg-[#EEF2F6] p-4 text-xs font-semibold text-[#182B5E] space-y-1">
              <p className="font-black uppercase tracking-wider">Next Step: Verification & Portal Access</p>
              <p className="text-[#5A6B8C]">
                A verification link has been sent to <strong>{formData.email}</strong>. Once verified, log in to your Student Dashboard to track your admission review and download payment instructions.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrint}
                iconLeading={<Printer size={16} />}
              >
                Print Receipt
              </Button>
              <Link to="/login">
                <Button
                  variant="primary"
                  size="md"
                  iconTrailing={<ArrowRight size={16} />}
                >
                  Log In to Student Portal
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Day 12 Registration Form */
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-6 sm:p-10 space-y-8"
          >
            {serverError && (
              <div className="border-[3px] border-[#D9381E] bg-[#FEE2E2] p-4 shadow-[4px_4px_0px_0px_#D9381E] flex items-start gap-3">
                <AlertTriangle size={20} className="text-[#D9381E] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-black uppercase tracking-wider text-[#D9381E]">Application Submission Notice</p>
                  <p className="font-bold text-[#182B5E] mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            {/* Step 1: Course & Batch Selection */}
            <div className="space-y-4">
              <div className="pb-2 border-b-2 border-[#182B5E] flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#182B5E]">
                  1. Program & Batch Selection
                </h2>
                <span className="text-xs font-bold text-[#D9381E] uppercase">Required</span>
              </div>

              {loadingCatalog ? (
                <div className="p-6 text-center space-y-2">
                  <Spinner size="md" variant="navy" />
                  <p className="text-xs font-bold text-[#5A6B8C]">Loading Courses & Batches...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Course / Discipline"
                    required
                    value={formData.courseId}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    options={courses.map((c) => ({
                      value: c.id,
                      label: `${c.name} (${c.duration || 'Flexible'})`,
                    }))}
                  />

                  <Select
                    label="Open Batch Schedule"
                    required
                    value={formData.batchId}
                    onChange={(e) => {
                      setFormData({ ...formData, batchId: e.target.value });
                      if (clientErrors.batchId) setClientErrors({ ...clientErrors, batchId: null });
                    }}
                    error={clientErrors.batchId}
                    options={
                      batches.length > 0
                        ? batches.map((b) => ({
                            value: b.id,
                            label: `${b.batch_name} — ${b.schedule || 'Flexible'}`,
                          }))
                        : [{ value: '', label: 'No open batches currently', disabled: true }]
                    }
                    hint="Seats allocated sequentially in order of registration"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Personal Profile */}
            <div className="space-y-4">
              <div className="pb-2 border-b-2 border-[#182B5E] flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#182B5E]">
                  2. Personal & Contact Profile
                </h2>
                <span className="text-xs font-bold text-[#5A6B8C] uppercase">Student Profile</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. A. Mohamed Safee"
                  value={formData.fullName}
                  error={clientErrors.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (clientErrors.fullName) setClientErrors({ ...clientErrors, fullName: null });
                  }}
                  iconLeading={<User size={16} />}
                />
                <Input
                  label="Home Town / City"
                  placeholder="e.g. Kalmunai, Sri Lanka"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  iconLeading={<MapPin size={16} />}
                />
                <Input
                  label="Mobile Phone"
                  required
                  placeholder="0771234567"
                  value={formData.phone}
                  error={clientErrors.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (clientErrors.phone) setClientErrors({ ...clientErrors, phone: null });
                  }}
                  iconLeading={<Phone size={16} />}
                />
                <Input
                  label="WhatsApp Number (Optional)"
                  placeholder="0771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  iconLeading={<Phone size={16} />}
                />
                <Input
                  type="date"
                  label="Date of Birth (Optional)"
                  value={formData.dob}
                  max={new Date().toISOString().split('T')[0]}
                  error={clientErrors.dob || clientErrors.date_of_birth}
                  onChange={(e) => {
                    setFormData({ ...formData, dob: e.target.value });
                    if (clientErrors.dob || clientErrors.date_of_birth) {
                      setClientErrors({ ...clientErrors, dob: null, date_of_birth: null });
                    }
                  }}
                  iconLeading={<Calendar size={16} />}
                />
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </div>
            </div>

            {/* Step 3: Portal Account Creation */}
            <div className="space-y-4">
              <div className="pb-2 border-b-2 border-[#182B5E] flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#182B5E]">
                  3. Student Portal Account
                </h2>
                <span className="text-xs font-bold text-[#5A6B8C] uppercase">For Tracking Status</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Email Address"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  error={clientErrors.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (clientErrors.email) setClientErrors({ ...clientErrors, email: null });
                  }}
                  iconLeading={<Mail size={16} />}
                />
                <Input
                  type="password"
                  label="Choose Password"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  error={clientErrors.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (clientErrors.password) setClientErrors({ ...clientErrors, password: null });
                  }}
                  iconLeading={<Lock size={16} />}
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t-2 border-[#182B5E] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-[#5A6B8C]">
                Submitting atomically reserves your seat and generates your tracking number.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
                iconTrailing={submitting ? <Spinner size="sm" variant="white" /> : <Send size={15} />}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Processing Application...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
