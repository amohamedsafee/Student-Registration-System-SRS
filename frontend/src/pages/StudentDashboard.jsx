import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input, Select, StatusBadge, Spinner, Modal } from '../components/ui';
import registrationApi from '../features/registration/api/registrationApi';
import studentApi from '../features/student-dashboard/api/studentApi';
import courseApi from '../features/courses/api/courseApi';
import { useAuth } from '../features/auth/context/AuthContext';
import {
  User,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  PlusCircle,
  XCircle,
  Edit3,
  CheckCircle,
  Info,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingReg, setCancellingReg] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    address: '',
    gender: 'male',
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [profileData, regList] = await Promise.all([
        studentApi.getProfile(),
        registrationApi.getMyRegistrations(),
      ]);
      setProfile(profileData);
      setRegistrations(regList || []);
      setEditForm({
        fullName: profileData.full_name || '',
        phone: profileData.phone_number || '',
        whatsapp: profileData.whatsapp_number || '',
        address: profileData.home_address || '',
        gender: profileData.gender || 'male',
      });
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      setError(err.message || 'Failed to load your student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Cancel Registration
  const handleOpenCancel = (reg) => {
    setCancellingReg(reg);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingReg) return;
    try {
      setActionLoading(true);
      await registrationApi.cancelRegistration(cancellingReg.id, cancelReason || 'Cancelled by student');
      setCancelModalOpen(false);
      setSuccessMsg(`Registration ${cancellingReg.registration_number} was successfully cancelled.`);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to cancel registration:', err);
      setError(err.message || 'Failed to cancel registration.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle View Details
  const handleViewDetails = async (reg) => {
    try {
      const fullDetails = await registrationApi.getMyRegistrationById(reg.id);
      setSelectedReg(fullDetails);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch registration details:', err);
      setError(err.message || 'Could not fetch registration details.');
    }
  };

  // Handle Open Additional Enrollment Modal
  const handleOpenEnrollModal = async () => {
    try {
      const courseList = await courseApi.getCourses();
      setCourses(courseList);
      if (courseList.length > 0) {
        setSelectedCourseId(courseList[0].id);
        const openBatches = await courseApi.getCourseBatches(courseList[0].id);
        setBatches(openBatches);
        if (openBatches.length > 0) {
          setSelectedBatchId(openBatches[0].id);
        }
      }
      setEnrollModalOpen(true);
    } catch (err) {
      console.error('Failed to load courses for enrollment:', err);
      setError('Could not load course options.');
    }
  };

  const handleEnrollCourseChange = async (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedBatchId('');
    try {
      const openBatches = await courseApi.getCourseBatches(courseId);
      setBatches(openBatches);
      if (openBatches.length > 0) {
        setSelectedBatchId(openBatches[0].id);
      }
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const handleConfirmAdditionalEnrollment = async (e) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    try {
      setActionLoading(true);
      const res = await registrationApi.applyAdditional(selectedBatchId);
      setEnrollModalOpen(false);
      setSuccessMsg(`Enrolled in new course! Reference: ${res.registration_number}`);
      await loadDashboardData();
    } catch (err) {
      console.error('Additional enrollment failed:', err);
      setError(err.message || 'Enrollment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await studentApi.updateProfile({
        full_name: editForm.fullName,
        phone_number: editForm.phone,
        whatsapp_number: editForm.whatsapp,
        home_address: editForm.address,
        gender: editForm.gender,
      });
      setEditProfileOpen(false);
      setSuccessMsg('Your profile has been updated successfully.');
      await loadDashboardData();
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.message || 'Profile update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#182B5E] mb-8">
          <div>
            <div className="eyebrow">Student Intake Portal · 2026</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#182B5E]">
              Student Dashboard
            </h1>
            <p className="text-sm font-semibold text-[#5A6B8C]">
              Manage your course admissions, check application statuses, and enroll in additional programs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              iconLeading={<Edit3 size={15} />}
              onClick={() => setEditProfileOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconLeading={<PlusCircle size={15} />}
              onClick={handleOpenEnrollModal}
            >
              Enroll in Another Course
            </Button>
          </div>
        </div>

        {/* Success or Error Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 border-[3px] border-[#116530] bg-[#DCFCE7] shadow-[4px_4px_0px_0px_#116530] flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-bold text-[#116530]">
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg('')}
              className="text-[#116530] font-black text-sm hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 border-[3px] border-[#D9381E] bg-[#FEE2E2] shadow-[4px_4px_0px_0px_#D9381E] flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-bold text-[#D9381E]">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-[#D9381E] font-black text-sm hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center space-y-4">
            <Spinner size="lg" variant="navy" />
            <p className="text-sm font-black uppercase text-[#5A6B8C]">
              Loading your academic records...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Student Profile Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-6 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b-2 border-[#182B5E]">
                  <div className="w-14 h-14 border-2 border-[#182B5E] bg-[#182B5E] text-white flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#182B5E]">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#182B5E] leading-tight">
                      {profile?.full_name || 'Enrolled Student'}
                    </h2>
                    <span className="text-xs font-bold text-[#5A6B8C] block">
                      {profile?.email}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#182B5E] bg-[#F7F9FC]">
                      {profile?.email_verified_at ? '✓ Email Verified' : '⚠ Email Pending'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-bold text-[#5A6B8C]">Mobile Phone:</span>
                    <span className="font-black text-[#182B5E]">{profile?.phone_number || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-bold text-[#5A6B8C]">WhatsApp:</span>
                    <span className="font-black text-[#182B5E]">{profile?.whatsapp_number || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-bold text-[#5A6B8C]">Town / Address:</span>
                    <span className="font-black text-[#182B5E]">{profile?.home_address || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-bold text-[#5A6B8C]">Gender:</span>
                    <span className="font-black text-[#182B5E] capitalize">{profile?.gender || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-[#5A6B8C]">Total Enrolled Programs:</span>
                    <span className="font-black text-[#182B5E]">{registrations.length}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditProfileOpen(true)}
                >
                  Update Contact Info
                </Button>
              </div>

              {/* Instructions / Help Box */}
              <div className="bg-[#EEF2F6] border-2 border-[#182B5E] p-5 shadow-[4px_4px_0px_0px_#182B5E] space-y-2 text-xs">
                <div className="font-black text-[#182B5E] flex items-center gap-1.5 uppercase">
                  <Info size={15} /> Admissions Notice
                </div>
                <p className="text-[#5A6B8C] font-semibold leading-relaxed">
                  Status changes are communicated via SMS and email. Once your status becomes <strong>CONFIRMED</strong>, you may proceed to the campus reception to collect your identity badge and course materials.
                </p>
              </div>
            </div>

            {/* Right Column: Registrations List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#182B5E]">
                <h2 className="text-base font-black uppercase tracking-wider text-[#182B5E]">
                  Enrolled Programs & Admission Status ({registrations.length})
                </h2>
                <span className="text-xs font-bold text-[#5A6B8C]">
                  Academic Year 2026
                </span>
              </div>

              {registrations.length === 0 ? (
                <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-10 text-center space-y-4">
                  <BookOpen size={48} className="mx-auto text-[#5A6B8C]" />
                  <h3 className="text-xl font-black text-[#182B5E]">
                    No Course Registrations Found
                  </h3>
                  <p className="text-xs font-semibold text-[#5A6B8C] max-w-sm mx-auto">
                    You have not enrolled in any programs yet. Browse our active language courses and book your seat.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenEnrollModal}
                    iconTrailing={<ChevronRight size={14} />}
                  >
                    Enroll in a Course Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 transition-all hover:translate-x-1 hover:translate-y-1"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#182B5E]">
                        <div>
                          <span className="font-mono text-xs font-black uppercase text-[#5A6B8C]">
                            Ref: {reg.registration_number}
                          </span>
                          <h3 className="text-xl font-black text-[#182B5E] mt-0.5">
                            {reg.course_name}
                          </h3>
                        </div>
                        <StatusBadge status={reg.status} size="md" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
                        <div>
                          <span className="font-bold text-[#5A6B8C] block uppercase">Batch:</span>
                          <span className="font-black text-[#182B5E]">{reg.batch_name}</span>
                        </div>
                        <div>
                          <span className="font-bold text-[#5A6B8C] block uppercase">Schedule:</span>
                          <span className="font-black text-[#182B5E]">{reg.schedule || 'Regular'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-[#5A6B8C] block uppercase">Applied On:</span>
                          <span className="font-black text-[#182B5E]">
                            {new Date(reg.registration_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(reg)}
                          iconTrailing={<ExternalLink size={14} />}
                        >
                          View Admission History
                        </Button>

                        {reg.status === 'PENDING' && (
                          <Button
                            variant="danger"
                            size="sm"
                            iconLeading={<XCircle size={14} />}
                            onClick={() => handleOpenCancel(reg)}
                          >
                            Cancel Application
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Course Registration"
        size="md"
      >
        <div className="space-y-4">
          <div className="border-[3px] border-[#D9381E] bg-[#FEE2E2] p-4 text-xs text-[#D9381E] font-bold">
            Are you sure you want to cancel registration <strong>{cancellingReg?.registration_number}</strong> for <strong>{cancellingReg?.course_name}</strong>? This action cannot be undone.
          </div>

          <Input
            label="Reason for cancellation (optional)"
            placeholder="e.g. Schedule clash, work commitments"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#182B5E]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
            >
              Keep Registration
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={actionLoading}
              onClick={handleConfirmCancel}
            >
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Registration Details & History Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Registration Details: ${selectedReg?.registration_number || ''}`}
        size="lg"
      >
        {selectedReg && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-[#182B5E] bg-[#F7F9FC] p-4 text-xs">
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Course Program:</span>
                <span className="font-black text-sm text-[#182B5E]">{selectedReg.course_name}</span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Batch & Schedule:</span>
                <span className="font-black text-sm text-[#182B5E]">{selectedReg.batch_name} ({selectedReg.schedule || 'Flexible'})</span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Current Status:</span>
                <StatusBadge status={selectedReg.status} size="sm" />
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Application Date:</span>
                <span className="font-black text-[#182B5E]">{new Date(selectedReg.registration_date).toLocaleString()}</span>
              </div>
            </div>

            {/* Status History Timeline */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#182B5E] pb-2 border-b-2 border-[#182B5E] mb-3">
                Official Admission Status History
              </h4>
              <div className="space-y-3">
                {selectedReg.history && selectedReg.history.length > 0 ? (
                  selectedReg.history.map((hist, index) => (
                    <div
                      key={hist.id || index}
                      className="border-2 border-[#182B5E] bg-white p-3 text-xs flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_#182B5E]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={hist.new_status} size="sm" />
                          {hist.old_status && (
                            <span className="text-[#5A6B8C] font-bold">
                              (changed from {hist.old_status})
                            </span>
                          )}
                        </div>
                        {hist.note && (
                          <p className="text-xs font-semibold text-[#182B5E] mt-1.5">
                            "{hist.note}"
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#5A6B8C] whitespace-nowrap">
                        {new Date(hist.changed_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5A6B8C]">No status changes recorded yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#182B5E]">
              <Button variant="secondary" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enroll in Another Course Modal */}
      <Modal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title="Enroll in an Additional Course"
        size="md"
      >
        <form onSubmit={handleConfirmAdditionalEnrollment} className="space-y-4">
          <p className="text-xs font-bold text-[#5A6B8C]">
            As a registered student, you can enroll in other disciplines without re-creating your student profile.
          </p>

          <Select
            label="Select Course"
            required
            value={selectedCourseId}
            onChange={(e) => handleEnrollCourseChange(e.target.value)}
            options={courses.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.duration || 'Flexible'})`,
            }))}
          />

          <Select
            label="Select Open Batch"
            required
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            options={
              batches.length > 0
                ? batches.map((b) => ({
                    value: b.id,
                    label: `${b.batch_name} — ${b.schedule || 'Flexible'}`,
                  }))
                : [{ value: '', label: 'No open batches currently', disabled: true }]
            }
          />

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#182B5E]">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEnrollModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={actionLoading || !selectedBatchId}
            >
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Confirm Enrollment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Update Student Profile"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={editForm.fullName}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
          />

          <Input
            label="Mobile Phone"
            required
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />

          <Input
            label="WhatsApp Number (Optional)"
            value={editForm.whatsapp}
            onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
          />

          <Input
            label="Town / Home Address"
            value={editForm.address}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
          />

          <Select
            label="Gender"
            value={editForm.gender}
            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#182B5E]">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
