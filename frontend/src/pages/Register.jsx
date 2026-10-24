import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input, Select, StatusBadge } from '../components/ui';
import { User, Mail, Lock, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    address: '',
    course: 'dip-eng',
    batch: 'batch-2026-a',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
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

        {submitted ? (
          <div className="max-w-xl mx-auto bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 border-2 border-[#182B5E] bg-[#116530] text-white flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#182B5E]">
              <CheckCircle size={32} />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#5A6B8C]">
                Official Admission Submission
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#182B5E] mt-1">
                Registration Received
              </h2>
            </div>

            <div className="border-2 border-[#182B5E] bg-[#F7F9FC] p-5 text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b-2 border-[#182B5E]">
                <span className="text-xs font-black uppercase text-[#5A6B8C]">Registration Number</span>
                <span className="font-mono text-xl font-black text-[#182B5E]">LLC-2026-000001</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#5A6B8C]">Application Status:</span>
                <StatusBadge status="PENDING" size="sm" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#5A6B8C]">Assigned Batch:</span>
                <span className="font-black text-[#182B5E]">Diploma in English (Batch 2026-A)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Application
              </Button>
              <Link to="/courses">
                <Button variant="primary" size="sm" iconTrailing={<ArrowRight size={14} />}>
                  Explore More Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-6 sm:p-10 space-y-8"
          >
            {/* Step 1: Course & Batch Selection */}
            <div className="space-y-4">
              <div className="pb-2 border-b-2 border-[#182B5E] flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#182B5E]">
                  1. Program & Batch Selection
                </h2>
                <span className="text-xs font-bold text-[#D9381E] uppercase">Required</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Course / Discipline"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  options={[
                    { value: 'dip-eng', label: 'Diploma in English & Communication (6 Mos)' },
                    { value: 'spoken-eng', label: 'Spoken English & Fluency Workshop (3 Mos)' },
                    { value: 'ielts', label: 'IELTS Academic Masterclass (2 Mos)' },
                    { value: 'sinhala', label: 'Sinhala for Everyday Communication (3 Mos)' },
                    { value: 'tamil', label: 'Tamil Language for Beginners (3 Mos)' },
                    { value: 'biz-eng', label: 'Business English & Workplace Communication' },
                  ]}
                />
                <Select
                  label="Batch Schedule"
                  required
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  options={[
                    { value: 'batch-2026-a', label: 'Batch 2026-A (Weekend Morning 8:30 AM)' },
                    { value: 'batch-2026-b', label: 'Batch 2026-B (Weekday Evening 5:00 PM)' },
                    { value: 'batch-2026-ft', label: 'Batch 2026-FastTrack (Mon-Thu 6:00 PM)' },
                  ]}
                  hint="Seats filled sequentially in order of submission"
                />
              </div>
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
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  iconLeading={<Phone size={16} />}
                />
                <Input
                  label="WhatsApp Number (Optional)"
                  placeholder="0771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  iconLeading={<Phone size={16} />}
                />
              </div>
            </div>

            {/* Step 3: Portal Account Creation */}
            <div className="space-y-4">
              <div className="pb-2 border-b-2 border-[#182B5E] flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#182B5E]">
                  3. Account Credentials
                </h2>
                <span className="text-xs font-bold text-[#5A6B8C] uppercase">For Status Tracking</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Email Address"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  iconLeading={<Mail size={16} />}
                />
                <Input
                  type="password"
                  label="Choose Password"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  iconLeading={<Lock size={16} />}
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t-2 border-[#182B5E] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-[#5A6B8C]">
                Submitting creates your profile and reserves your registration spot.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="md"
                iconTrailing={<Send size={15} />}
                className="w-full sm:w-auto"
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
