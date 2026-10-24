import React, { useState, useEffect } from 'react';
import { Button, Input, Select, StatusBadge, Spinner, Modal } from '../../components/ui';
import adminApi from '../../features/admin-dashboard/api/adminApi';
import courseApi from '../../features/courses/api/courseApi';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    course_id: '',
    date_from: '',
    date_to: '',
    page: 1,
    limit: 10,
  });

  // Detail & Status Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('PENDING');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  // Load courses for filter
  useEffect(() => {
    courseApi.getCourses().then((data) => setCourses(data || [])).catch(console.error);
  }, []);

  // Fetch registrations whenever filters change
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getRegistrations(filters);
      setRegistrations(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load registrations:', err);
      setError(err.message || 'Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filters.page, filters.status, filters.course_id, filters.date_from, filters.date_to]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchRegistrations();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      course_id: '',
      date_from: '',
      date_to: '',
      page: 1,
      limit: 10,
    });
  };

  // Open details
  const handleOpenDetails = async (reg) => {
    try {
      setDetailLoading(true);
      setDetailModalOpen(true);
      const fullDetails = await adminApi.getRegistrationDetails(reg.id);
      setSelectedReg(fullDetails);
      setNewStatus(fullDetails.status);
      setStatusNote('');
    } catch (err) {
      console.error('Fetch registration detail error:', err);
      setError(err.message || 'Could not fetch registration details.');
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReg) return;
    try {
      setUpdatingStatus(true);
      await adminApi.updateRegistrationStatus(selectedReg.id, newStatus, statusNote);
      setSuccessMsg(`Registration ${selectedReg.registration_number} status updated to ${newStatus}.`);
      setDetailModalOpen(false);
      await fetchRegistrations();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle CSV Export
  const handleExportCsv = async () => {
    try {
      setExportingCsv(true);
      await adminApi.exportCsv({
        search: filters.search,
        status: filters.status,
        course_id: filters.course_id,
        date_from: filters.date_from,
        date_to: filters.date_to,
      });
    } catch (err) {
      console.error('Export CSV error:', err);
      setError(err.message || 'CSV export failed.');
    } finally {
      setExportingCsv(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#182B5E]">
        <div>
          <div className="eyebrow">Direct Admissions Intake · 2026</div>
          <h1 className="text-3xl font-black text-[#182B5E] tracking-tight">
            Review Registrations
          </h1>
          <p className="text-xs font-semibold text-[#5A6B8C] mt-1">
            Search, verify student applicants, update admission statuses, and export audit data.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          iconLeading={exportingCsv ? <Spinner size="sm" variant="navy" /> : <Download size={18} />}
          disabled={exportingCsv}
          onClick={handleExportCsv}
        >
          {exportingCsv ? 'Generating CSV...' : 'Export to CSV'}
        </Button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 border-[3px] border-[#116530] bg-[#DCFCE7] shadow-[4px_4px_0px_0px_#116530] flex items-center justify-between text-xs font-bold text-[#116530]">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="underline uppercase">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 border-[3px] border-[#D9381E] bg-[#FEE2E2] shadow-[4px_4px_0px_0px_#D9381E] flex items-center justify-between text-xs font-bold text-[#D9381E]">
          <span>{error}</span>
          <button onClick={() => setError('')} className="underline uppercase">Dismiss</button>
        </div>
      )}

      {/* Multi-Criteria Filter Bar */}
      <div className="bg-white border-[3px] border-[#182B5E] p-6 shadow-[6px_6px_0px_0px_#182B5E] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#182B5E]">
            <Filter size={15} /> Search & Query Filters
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-[#D9381E] hover:underline"
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            placeholder="Search name, reg #, phone..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            iconLeading={<Search size={15} />}
          />

          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'UNDER_REVIEW', label: 'Under Review' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />

          <Select
            value={filters.course_id}
            onChange={(e) => setFilters({ ...filters, course_id: e.target.value, page: 1 })}
            options={[
              { value: '', label: 'All Courses' },
              ...courses.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />

          <Input
            type="date"
            placeholder="From Date"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value, page: 1 })}
          />

          <Button type="submit" variant="primary" size="md" className="w-full justify-center">
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Registrations Data Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Spinner size="lg" variant="navy" />
          <p className="text-xs font-black uppercase text-[#5A6B8C]">Searching registration records...</p>
        </div>
      ) : (
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#182B5E] text-white uppercase tracking-wider text-[11px] font-black border-b-[3px] border-[#182B5E]">
                <th className="p-4">Reg #</th>
                <th className="p-4">Student Name & Contact</th>
                <th className="p-4">Course & Batch</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center font-bold text-[#5A6B8C]">
                    No registrations found matching the specified criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="p-4 font-mono font-black text-[#182B5E] whitespace-nowrap">
                      {reg.registration_number}
                    </td>
                    <td className="p-4">
                      <div className="font-black text-sm text-[#182B5E]">{reg.student_name}</div>
                      <div className="text-[11px] font-semibold text-[#5A6B8C] mt-0.5">
                        {reg.phone_number} · {reg.student_email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#182B5E]">{reg.course_name}</div>
                      <div className="text-[11px] font-semibold text-[#5A6B8C]">
                        {reg.batch_name}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#5A6B8C] whitespace-nowrap">
                      {new Date(reg.registration_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={reg.status} size="sm" />
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconLeading={<Eye size={14} />}
                        onClick={() => handleOpenDetails(reg)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-4 bg-[#F7F9FC] border-t-2 border-[#182B5E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-bold text-[#5A6B8C]">
              Showing <span className="font-black text-[#182B5E]">{registrations.length}</span> of{' '}
              <span className="font-black text-[#182B5E]">{pagination.total}</span> records (Page {pagination.page} of {pagination.totalPages || 1})
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                iconLeading={<ChevronLeft size={14} />}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                iconTrailing={<ChevronRight size={14} />}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review & Status Update Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Registration Review: ${selectedReg?.registration_number || ''}`}
        size="lg"
      >
        {detailLoading ? (
          <div className="py-12 text-center space-y-2">
            <Spinner size="md" variant="navy" />
            <p className="text-xs font-black uppercase text-[#5A6B8C]">Loading student dossier...</p>
          </div>
        ) : selectedReg && (
          <div className="space-y-6">
            {/* Student & Course Dossier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-[#182B5E] bg-[#F7F9FC] p-4 text-xs">
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Student Name:</span>
                <span className="font-black text-sm text-[#182B5E]">{selectedReg.full_name}</span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Email Address:</span>
                <span className="font-black text-[#182B5E]">{selectedReg.email}</span>
                <span className="text-[10px] ml-1 font-bold text-[#116530]">
                  {selectedReg.email_verified_at ? '(Verified)' : '(Pending Verification)'}
                </span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Mobile & WhatsApp:</span>
                <span className="font-black text-[#182B5E]">{selectedReg.phone_number} {selectedReg.whatsapp_number ? ` / ${selectedReg.whatsapp_number}` : ''}</span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Home Address:</span>
                <span className="font-black text-[#182B5E]">{selectedReg.home_address || '—'}</span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Applied Program:</span>
                <span className="font-black text-[#182B5E]">{selectedReg.course_name} ({selectedReg.course_duration || 'Flexible'})</span>
              </div>
              <div>
                <span className="font-bold text-[#5A6B8C] block uppercase">Batch & Schedule:</span>
                <span className="font-black text-[#182B5E]">{selectedReg.batch_name} — {selectedReg.schedule || 'Flexible'}</span>
              </div>
            </div>

            {/* Status Update Action Box (Day 20) */}
            <form onSubmit={handleUpdateStatusSubmit} className="bg-white border-2 border-[#182B5E] p-4 shadow-[4px_4px_0px_0px_#182B5E] space-y-4">
              <div className="pb-2 border-b-2 border-[#182B5E] flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
                  Modify Admission Status
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#5A6B8C]">Current:</span>
                  <StatusBadge status={selectedReg.status} size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="New Official Status"
                  required
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={[
                    { value: 'PENDING', label: 'PENDING — Awaiting Review' },
                    { value: 'UNDER_REVIEW', label: 'UNDER_REVIEW — Documents Checked' },
                    { value: 'CONFIRMED', label: 'CONFIRMED — Seat Allocated' },
                    { value: 'REJECTED', label: 'REJECTED — Ineligible / Duplicate' },
                    { value: 'CANCELLED', label: 'CANCELLED — Student Withdrawn' },
                  ]}
                />

                <Input
                  label="Administrative Note (Audit Trail)"
                  placeholder="e.g. Paid registration fee at counter"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? <Spinner size="sm" variant="white" /> : 'Commit Status Update'}
                </Button>
              </div>
            </form>

            {/* Status History Timeline */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#182B5E] pb-2 border-b-2 border-[#182B5E] mb-3 flex items-center gap-2">
                <Clock size={14} /> Official Audit & History Log
              </h4>
              <div className="space-y-2">
                {selectedReg.history && selectedReg.history.length > 0 ? (
                  selectedReg.history.map((hist, idx) => (
                    <div
                      key={hist.id || idx}
                      className="border border-[#182B5E] bg-white p-3 text-xs flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_#182B5E]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={hist.new_status} size="sm" />
                          {hist.old_status && (
                            <span className="text-[#5A6B8C] font-semibold">
                              (changed from {hist.old_status})
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-[#182B5E]">
                            by {hist.changed_by_email || 'System / Direct'}
                          </span>
                        </div>
                        {hist.note && (
                          <p className="text-xs font-semibold text-[#182B5E] mt-1 italic">
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
                  <p className="text-xs text-[#5A6B8C] italic">No prior status transitions.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#182B5E]">
              <Button variant="secondary" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
