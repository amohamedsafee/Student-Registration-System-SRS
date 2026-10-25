import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import courseApi from '../features/courses/api/courseApi';
import BatchSelector from '../features/courses/components/BatchSelector';
import { Button, StatusBadge, Spinner } from '../components/ui';
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  Send,
  AlertTriangle,
} from 'lucide-react';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);
        const data = await courseApi.getCourseById(id);
        if (isMounted) {
          setCourse(data);
          if (data.batches && data.batches.length > 0) {
            setSelectedBatchId(data.batches[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Course details could not be loaded');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      fetchCourse();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
        <Navbar />
        <main className="llc-container py-20 flex items-center justify-center">
          <div className="p-8 border-[3px] border-[#182B5E] bg-white shadow-[8px_8px_0px_0px_#182B5E] text-center space-y-4">
            <Spinner size="lg" variant="navy" />
            <p className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
              Loading Course Details...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
        <Navbar />
        <main className="llc-container py-20 flex items-center justify-center">
          <div className="max-w-md w-full p-8 border-[3px] border-[#182B5E] bg-white shadow-[8px_8px_0px_0px_#182B5E] text-center space-y-4">
            <div className="inline-block p-2 bg-[#D9381E] text-white border-2 border-[#182B5E] font-black text-xs uppercase tracking-widest">
              Course Unavailable
            </div>
            <h2 className="text-2xl font-black text-[#182B5E]">Course Not Found</h2>
            <p className="text-sm font-semibold text-[#5A6B8C]">
              {error || 'The requested course does not exist or has been retired.'}
            </p>
            <Link to="/courses" className="btn-primary inline-flex mt-4 text-xs">
              ← Return to Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const learningOutcomes = [
    'Complete syllabus designed for academic rigor and career employment.',
    'Interactive oral speaking and written assignments with expert lecturers.',
    'Periodic assessment tests simulating real-world exams and tests.',
    'Official Language Learning Campus Certificate awarded upon graduation.',
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-12 space-y-12">
        {/* Back navigation */}
        <div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#182B5E] hover:text-[#D9381E] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to All Courses</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="eyebrow mb-0">
                  Accredited Program
                </div>
                <StatusBadge status={course.is_active ? 'OPEN' : 'CLOSED'} size="sm" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#182B5E] tracking-tight leading-tight">
                {course.name}
              </h1>

              <p className="text-base sm:text-lg text-[#5A6B8C] font-semibold leading-relaxed border-l-4 border-[#116530] pl-4">
                {course.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-[#182B5E]">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-[#5A6B8C] flex items-center gap-1.5">
                    <Clock size={13} className="text-[#D9381E]" />
                    <span>Duration</span>
                  </span>
                  <span className="text-base font-black text-[#182B5E] block">
                    {course.duration || '6 Months'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-[#5A6B8C] flex items-center gap-1.5">
                    <Users size={13} className="text-[#116530]" />
                    <span>Delivery</span>
                  </span>
                  <span className="text-base font-black text-[#182B5E] block">
                    Campus Labs
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-[#5A6B8C] flex items-center gap-1.5">
                    <Award size={13} className="text-[#F28C28]" />
                    <span>Award</span>
                  </span>
                  <span className="text-base font-black text-[#182B5E] block">
                    Certificate
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Outcomes & Syllabus */}
            <div className="brutal-card-flat space-y-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-[#182B5E] border-b-2 border-[#182B5E] pb-2">
                What You Will Achieve
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {learningOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-[#182B5E]">
                    <CheckCircle2 size={16} className="text-[#116530] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Selector */}
            <div className="bg-white border-[3px] border-[#182B5E] p-8 shadow-[6px_6px_0px_0px_#182B5E]">
              <BatchSelector
                batches={course.batches || []}
                selectedBatchId={selectedBatchId}
                onSelectBatch={(id) => setSelectedBatchId(id)}
                courseId={course.id}
              />
            </div>
          </div>

          {/* Sticky Side Card */}
          <div className="space-y-6 sticky top-28">
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-6 space-y-6">
              <div className="border-b-2 border-[#182B5E] pb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#5A6B8C]">
                  Registration Summary
                </span>
                <div className="text-2xl font-black text-[#182B5E] mt-1">
                  LLC Intake 2026
                </div>
              </div>

              <div className="space-y-3 text-xs font-bold text-[#5A6B8C]">
                <div className="flex justify-between">
                  <span>Selected Program:</span>
                  <span className="text-[#182B5E] text-right font-black max-w-[150px] truncate">
                    {course.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-[#182B5E] font-black">Kalmunai Campus</span>
                </div>
                <div className="flex justify-between">
                  <span>Admission Status:</span>
                  <span className="text-[#116530] font-black">Open For Applications</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/register?course=${course.id}${selectedBatchId ? `&batch=${selectedBatchId}` : ''}`}
                  className="block"
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    iconTrailing={<Send size={15} />}
                  >
                    Apply For This Program
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-[#5A6B8C] font-semibold mt-2">
                  No advance payment needed to submit initial application.
                </p>
              </div>
            </div>

            {/* Help Callout */}
            <div className="border-2 border-[#182B5E] bg-[#F7F9FC] p-4 text-xs font-semibold text-[#182B5E] space-y-1">
              <span className="font-black block uppercase text-[#D9381E]">Need Assistance?</span>
              <p className="text-[#5A6B8C]">
                Call admissions at <strong className="text-[#182B5E]">+94 67 222 9800</strong> or email <a href="mailto:info@llc.edu.lk" className="underline text-[#182B5E]">info@llc.edu.lk</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
