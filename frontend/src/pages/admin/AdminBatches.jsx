import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Spinner, Modal } from '../../components/ui';
import adminApi from '../../features/admin-dashboard/api/adminApi';
import {
  Calendar,
  PlusCircle,
  Edit2,
  Lock,
  Unlock,
  Search,
  Clock,
  Layers,
} from 'lucide-react';

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    course_id: '',
    batch_name: '',
    start_date: '',
    schedule: '',
    is_registration_open: true,
  });

  const loadBatchesAndCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const [batchList, courseList] = await Promise.all([
        adminApi.getBatches(),
        adminApi.getCourses(),
      ]);
      setBatches(batchList || []);
      setCourses(courseList || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
      setError(err.message || 'Failed to load batches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchesAndCourses();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      course_id: courses.length > 0 ? courses[0].id : '',
      batch_name: '',
      start_date: new Date().toISOString().split('T')[0],
      schedule: 'Weekends 9:00 AM - 1:00 PM',
      is_registration_open: true,
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      course_id: batch.course_id,
      batch_name: batch.batch_name,
      start_date: batch.start_date ? batch.start_date.split('T')[0] : '',
      schedule: batch.schedule || '',
      is_registration_open: Boolean(batch.is_registration_open),
    });
    setEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_id || !formData.batch_name.trim()) return;
    try {
      setActionLoading(true);
      await adminApi.createBatch(formData);
      setCreateModalOpen(false);
      setSuccessMsg(`Batch '${formData.batch_name}' created successfully.`);
      await loadBatchesAndCourses();
    } catch (err) {
      console.error('Create batch error:', err);
      setError(err.message || 'Failed to create batch.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !formData.batch_name.trim()) return;
    try {
      setActionLoading(true);
      await adminApi.updateBatch(selectedBatch.id, formData);
      setEditModalOpen(false);
      setSuccessMsg(`Batch '${formData.batch_name}' updated successfully.`);
      await loadBatchesAndCourses();
    } catch (err) {
      console.error('Update batch error:', err);
      setError(err.message || 'Failed to update batch.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRegistrationOpen = async (batch) => {
    const newStatus = !batch.is_registration_open;
    try {
      await adminApi.setBatchRegistrationOpen(batch.id, newStatus);
      setSuccessMsg(
        `Registration for '${batch.batch_name}' is now ${newStatus ? 'OPEN' : 'CLOSED'}.`
      );
      await loadBatchesAndCourses();
    } catch (err) {
      console.error('Toggle registration error:', err);
      setError(err.message || 'Failed to change batch status.');
    }
  };

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.schedule && b.schedule.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCourse = courseFilter ? b.course_id === courseFilter : true;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#182B5E]">
        <div>
          <div className="eyebrow">Academic Scheduling & Intakes</div>
          <h1 className="text-3xl font-black text-[#182B5E] tracking-tight">
            Batches & Schedules
          </h1>
          <p className="text-xs font-semibold text-[#5A6B8C] mt-1">
            Configure intake groups, timetables, and open/close admission windows in real time.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          iconLeading={<PlusCircle size={18} />}
          onClick={handleOpenCreate}
        >
          Add New Batch
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

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-[#182B5E] p-4 shadow-[4px_4px_0px_0px_#182B5E]">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search batches, schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              iconLeading={<Search size={16} />}
            />
          </div>
          <div className="w-full sm:w-60">
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              options={[
                { value: '', label: 'All Courses Filter' },
                ...courses.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>
        </div>

        <div className="text-xs font-black uppercase text-[#5A6B8C]">
          Total Batches: <span className="text-[#182B5E] text-sm">{filteredBatches.length}</span>
        </div>
      </div>

      {/* Batches Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Spinner size="lg" variant="navy" />
          <p className="text-xs font-black uppercase text-[#5A6B8C]">Loading batch schedules...</p>
        </div>
      ) : (
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#182B5E] text-white uppercase tracking-wider text-[11px] font-black border-b-[3px] border-[#182B5E]">
                <th className="p-4">Parent Course</th>
                <th className="p-4">Batch Name</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">Schedule Timetable</th>
                <th className="p-4 text-center">Enrolled</th>
                <th className="p-4 text-center">Registration</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center font-bold text-[#5A6B8C]">
                    No batches found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="p-4 font-black text-[#182B5E]">
                      {b.course_name}
                    </td>
                    <td className="p-4 font-black text-sm text-[#182B5E]">
                      {b.batch_name}
                    </td>
                    <td className="p-4 font-bold text-[#5A6B8C]">
                      {b.start_date ? new Date(b.start_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 font-semibold text-[#182B5E]">
                      {b.schedule || 'Flexible'}
                    </td>
                    <td className="p-4 text-center font-black text-[#182B5E]">
                      {b.total_registrations || 0}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                          b.is_registration_open
                            ? 'bg-[#DCFCE7] text-[#116530] border-[#116530]'
                            : 'bg-[#FEE2E2] text-[#D9381E] border-[#D9381E]'
                        }`}
                      >
                        {b.is_registration_open ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconLeading={<Edit2 size={13} />}
                          onClick={() => handleOpenEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={b.is_registration_open ? 'danger' : 'secondary'}
                          size="sm"
                          iconLeading={b.is_registration_open ? <Lock size={12} /> : <Unlock size={12} />}
                          onClick={() => handleToggleRegistrationOpen(b)}
                        >
                          {b.is_registration_open ? 'Close' : 'Open'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Batch Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Course Batch"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Select
            label="Course Program"
            required
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: c.name }))}
          />

          <Input
            label="Batch Name / Code"
            required
            placeholder="e.g. Batch 2026-Weekend-A"
            value={formData.batch_name}
            onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
          />

          <Input
            type="date"
            label="Commencement Date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />

          <Input
            label="Timetable Schedule"
            placeholder="e.g. Saturdays & Sundays 9:00 AM - 1:00 PM"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="create_reg_open"
              checked={formData.is_registration_open}
              onChange={(e) => setFormData({ ...formData, is_registration_open: e.target.checked })}
              className="w-4 h-4 border-2 border-[#182B5E]"
            />
            <label htmlFor="create_reg_open" className="text-xs font-bold text-[#182B5E]">
              Open batch for student intake immediately
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#182B5E]">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Create Batch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Batch Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Batch: ${selectedBatch?.batch_name || ''}`}
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Select
            label="Parent Course"
            required
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: c.name }))}
          />

          <Input
            label="Batch Name"
            required
            value={formData.batch_name}
            onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
          />

          <Input
            type="date"
            label="Commencement Date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />

          <Input
            label="Schedule Details"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="edit_reg_open"
              checked={formData.is_registration_open}
              onChange={(e) => setFormData({ ...formData, is_registration_open: e.target.checked })}
              className="w-4 h-4 border-2 border-[#182B5E]"
            />
            <label htmlFor="edit_reg_open" className="text-xs font-bold text-[#182B5E]">
              Registration Open for Applicants
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#182B5E]">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Save Batch Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
