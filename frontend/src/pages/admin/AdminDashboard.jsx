import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Spinner, StatusBadge } from '../../components/ui';
import adminApi from '../../features/admin-dashboard/api/adminApi';
import {
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Download,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentRegs, setRecentRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, regsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getRegistrations({ limit: 5, page: 1 }),
      ]);
      setStats(statsData);
      setRecentRegs(regsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleExportCsv = async () => {
    try {
      setExportingCsv(true);
      await adminApi.exportCsv();
    } catch (err) {
      console.error('Export CSV error:', err);
      setError(err.message || 'CSV export failed.');
    } finally {
      setExportingCsv(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Spinner size="lg" variant="navy" />
        <p className="text-xs font-black uppercase text-[#5A6B8C]">
          Calculating admissions analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#182B5E]">
        <div>
          <div className="eyebrow">Executive Intelligence & Overview</div>
          <h1 className="text-3xl font-black text-[#182B5E] tracking-tight">
            Admissions Dashboard
          </h1>
          <p className="text-xs font-semibold text-[#5A6B8C] mt-1">
            Real-time enrollment counts, pending review queues, and intake statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            iconLeading={exportingCsv ? <Spinner size="sm" variant="navy" /> : <FileSpreadsheet size={16} />}
            disabled={exportingCsv}
            onClick={handleExportCsv}
          >
            {exportingCsv ? 'Exporting...' : 'Export All to CSV'}
          </Button>

          <Link to="/admin/registrations">
            <Button
              variant="primary"
              size="md"
              iconTrailing={<ArrowRight size={16} />}
            >
              Review Applications
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 border-[3px] border-[#D9381E] bg-[#FEE2E2] shadow-[4px_4px_0px_0px_#D9381E] text-xs font-bold text-[#D9381E]">
          {error}
        </div>
      )}

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total */}
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
              Total Applications
            </span>
            <div className="p-2 border-2 border-[#182B5E] bg-[#F7F9FC]">
              <Users size={16} className="text-[#182B5E]" />
            </div>
          </div>
          <div className="text-4xl font-black text-[#182B5E]">
            {stats?.total || 0}
          </div>
          <p className="text-[11px] font-bold text-[#5A6B8C]">
            All-time direct intakes recorded
          </p>
        </div>

        {/* Card 2: Pending Review */}
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#F28C28]">
              Pending Review
            </span>
            <div className="p-2 border-2 border-[#182B5E] bg-[#FFFBEB]">
              <Clock size={16} className="text-[#F28C28]" />
            </div>
          </div>
          <div className="text-4xl font-black text-[#F28C28]">
            {stats?.byStatus?.PENDING || 0}
          </div>
          <p className="text-[11px] font-bold text-[#5A6B8C]">
            Awaiting admission officer verification
          </p>
        </div>

        {/* Card 3: Confirmed */}
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#116530]">
              Confirmed Seats
            </span>
            <div className="p-2 border-2 border-[#182B5E] bg-[#DCFCE7]">
              <CheckCircle2 size={16} className="text-[#116530]" />
            </div>
          </div>
          <div className="text-4xl font-black text-[#116530]">
            {stats?.byStatus?.CONFIRMED || 0}
          </div>
          <p className="text-[11px] font-bold text-[#5A6B8C]">
            Approved & fee-verified students
          </p>
        </div>

        {/* Card 4: Registered Today */}
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#D9381E]">
              Registered Today
            </span>
            <div className="p-2 border-2 border-[#182B5E] bg-[#FEE2E2]">
              <TrendingUp size={16} className="text-[#D9381E]" />
            </div>
          </div>
          <div className="text-4xl font-black text-[#D9381E]">
            {stats?.registeredToday || 0}
          </div>
          <p className="text-[11px] font-bold text-[#5A6B8C]">
            New intakes submitted today
          </p>
        </div>
      </div>

      {/* Program Distribution & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Popularity Breakdown */}
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-5">
          <div className="pb-3 border-b-2 border-[#182B5E] flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
              Enrollment Distribution by Course
            </h2>
            <Link to="/admin/courses" className="text-[11px] font-black text-[#D9381E] hover:underline">
              Manage Courses
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.byCourse?.map((c) => {
              const max = Math.max(...(stats.byCourse.map((x) => x.count) || [1]), 1);
              const percentage = Math.round((c.count / max) * 100);
              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#182B5E]">{c.name}</span>
                    <span className="font-black text-[#182B5E]">{c.count} students</span>
                  </div>
                  <div className="w-full h-3 bg-[#EEF2F6] border border-[#182B5E]">
                    <div
                      className="h-full bg-[#182B5E] transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution Breakdown */}
        <div className="bg-white border-[3px] border-[#182B5E] shadow-[6px_6px_0px_0px_#182B5E] p-6 space-y-5">
          <div className="pb-3 border-b-2 border-[#182B5E] flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
              Application Pipeline Stages
            </h2>
            <span className="text-[11px] font-bold text-[#5A6B8C]">
              Admission Workflow
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Pending Initial Verification', status: 'PENDING', count: stats?.byStatus?.PENDING || 0 },
              { label: 'Under Review & Documentation', status: 'UNDER_REVIEW', count: stats?.byStatus?.UNDER_REVIEW || 0 },
              { label: 'Confirmed & Enrolled', status: 'CONFIRMED', count: stats?.byStatus?.CONFIRMED || 0 },
              { label: 'Rejected Applications', status: 'REJECTED', count: stats?.byStatus?.REJECTED || 0 },
              { label: 'Cancelled by Student', status: 'CANCELLED', count: stats?.byStatus?.CANCELLED || 0 },
            ].map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between p-3 border-2 border-[#182B5E] bg-[#F7F9FC] shadow-[2px_2px_0px_0px_#182B5E]"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-xs font-bold text-[#182B5E]">{item.label}</span>
                </div>
                <span className="font-mono font-black text-sm text-[#182B5E]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications Quick Review */}
      <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-6 space-y-4">
        <div className="pb-3 border-b-2 border-[#182B5E] flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#182B5E]">
              Latest Registration Submissions
            </h2>
            <p className="text-xs font-semibold text-[#5A6B8C]">
              Recently arrived direct intake records
            </p>
          </div>
          <Link to="/admin/registrations">
            <Button variant="ghost" size="sm" iconTrailing={<ArrowRight size={14} />}>
              View All Registrations
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#182B5E] text-white uppercase text-[10px] font-black border-b-[2px] border-[#182B5E]">
                <th className="p-3">Reg #</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Course</th>
                <th className="p-3">Batch</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200">
              {recentRegs.map((reg) => (
                <tr key={reg.id} className="hover:bg-[#F7F9FC]">
                  <td className="p-3 font-mono font-black text-[#182B5E]">
                    {reg.registration_number}
                  </td>
                  <td className="p-3 font-black text-[#182B5E]">
                    {reg.student_name}
                  </td>
                  <td className="p-3 font-semibold text-[#182B5E]">
                    {reg.course_name}
                  </td>
                  <td className="p-3 font-semibold text-[#5A6B8C]">
                    {reg.batch_name}
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={reg.status} size="sm" />
                  </td>
                  <td className="p-3 text-right font-bold text-[#5A6B8C]">
                    {new Date(reg.registration_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
