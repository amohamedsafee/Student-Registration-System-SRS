import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Spinner, Modal } from '../../components/ui';
import adminApi from '../../features/admin-dashboard/api/adminApi';
import {
  BookOpen,
  PlusCircle,
  Edit2,
  CheckCircle2,
  XCircle,
  Search,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: '',
    is_active: true,
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getCourses();
      setCourses(data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      duration: '3 Months',
      description: '',
      is_active: true,
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      duration: course.duration || '',
      description: course.description || '',
      is_active: Boolean(course.is_active),
    });
    setEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      setActionLoading(true);
      await adminApi.createCourse(formData);
      setCreateModalOpen(false);
      setSuccessMsg(`Course '${formData.name}' created successfully.`);
      await loadCourses();
    } catch (err) {
      console.error('Create course error:', err);
      setError(err.message || 'Failed to create course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !formData.name.trim()) return;
    try {
      setActionLoading(true);
      await adminApi.updateCourse(selectedCourse.id, formData);
      setEditModalOpen(false);
      setSuccessMsg(`Course '${formData.name}' updated successfully.`);
      await loadCourses();
    } catch (err) {
      console.error('Update course error:', err);
      setError(err.message || 'Failed to update course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (course) => {
    const newActiveState = !course.is_active;
    try {
      await adminApi.setCourseActive(course.id, newActiveState);
      setSuccessMsg(`Course status updated to ${newActiveState ? 'ACTIVE' : 'INACTIVE'}.`);
      await loadCourses();
    } catch (err) {
      console.error('Toggle status error:', err);
      setError(err.message || 'Failed to update status.');
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.duration && c.duration.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#182B5E]">
        <div>
          <div className="eyebrow">Academic Curriculum Management</div>
          <h1 className="text-3xl font-black text-[#182B5E] tracking-tight">
            Courses Catalog
          </h1>
          <p className="text-xs font-semibold text-[#5A6B8C] mt-1">
            Create, update, and manage official language programs and their public visibility.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          iconLeading={<PlusCircle size={18} />}
          onClick={handleOpenCreate}
        >
          Create New Course
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

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-[#182B5E] p-4 shadow-[4px_4px_0px_0px_#182B5E]">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by course name or duration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeading={<Search size={16} />}
          />
        </div>
        <div className="text-xs font-black uppercase text-[#5A6B8C]">
          Total Courses: <span className="text-[#182B5E] text-sm">{filteredCourses.length}</span>
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Spinner size="lg" variant="navy" />
          <p className="text-xs font-black uppercase text-[#5A6B8C]">Loading courses catalog...</p>
        </div>
      ) : (
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#182B5E] text-white uppercase tracking-wider text-[11px] font-black border-b-[3px] border-[#182B5E]">
                <th className="p-4">Course Name & Details</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-center">Active Batches</th>
                <th className="p-4 text-center">Total Enrolled</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center font-bold text-[#5A6B8C]">
                    No courses match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="p-4">
                      <div className="font-black text-sm text-[#182B5E]">{c.name}</div>
                      {c.description && (
                        <p className="text-[11px] font-semibold text-[#5A6B8C] line-clamp-1 mt-0.5">
                          {c.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 font-bold text-[#182B5E]">
                      {c.duration || 'Flexible'}
                    </td>
                    <td className="p-4 text-center font-black text-[#182B5E]">
                      {c.total_batches}
                    </td>
                    <td className="p-4 text-center font-black text-[#182B5E]">
                      {c.total_registrations || 0}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                          c.is_active
                            ? 'bg-[#DCFCE7] text-[#116530] border-[#116530]'
                            : 'bg-[#FEE2E2] text-[#D9381E] border-[#D9381E]'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconLeading={<Edit2 size={13} />}
                          onClick={() => handleOpenEdit(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={c.is_active ? 'outline' : 'secondary'}
                          size="sm"
                          onClick={() => handleToggleActive(c)}
                        >
                          {c.is_active ? 'Deactivate' : 'Activate'}
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

      {/* Create Course Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Course Program"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Course Name"
            required
            placeholder="e.g. Spoken English & Communication"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Duration"
            placeholder="e.g. 3 Months / 120 Hours"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full p-2.5 border-2 border-[#182B5E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#182B5E]"
              placeholder="Overview of curriculum and objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="create_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 border-2 border-[#182B5E]"
            />
            <label htmlFor="create_is_active" className="text-xs font-bold text-[#182B5E]">
              Make course active immediately for public registrations
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
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Course: ${selectedCourse?.name || ''}`}
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Course Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full p-2.5 border-2 border-[#182B5E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#182B5E]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="edit_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 border-2 border-[#182B5E]"
            />
            <label htmlFor="edit_is_active" className="text-xs font-bold text-[#182B5E]">
              Active Course (visible in catalog)
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
              {actionLoading ? <Spinner size="sm" variant="white" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
