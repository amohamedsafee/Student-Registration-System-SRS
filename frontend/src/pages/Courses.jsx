import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../features/courses/components/CourseCard';
import courseApi from '../features/courses/api/courseApi';
import { Spinner, Input } from '../components/ui';
import { Search } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      try {
        setLoading(true);
        const data = await courseApi.getCourses();
        if (isMounted) setCourses(data);
      } catch (err) {
        console.error('Failed to load courses from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.duration && c.duration.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="eyebrow">
            Academic Year 2026 Admissions
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#182B5E]">
            All Campus <span className="text-[#D9381E]">Language Programs</span>
          </h1>
          <p className="text-base sm:text-lg text-[#5A6B8C] font-semibold">
            Choose your language discipline and pick an open batch. Seats are allocated on a first-come basis.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-4">
            <Input
              id="course-search"
              placeholder="Search courses (e.g. English, IELTS, Sinhala)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeading={<Search size={18} />}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Spinner size="lg" variant="navy" />
            <p className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
              Loading Campus Catalog...
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 border-[3px] border-[#182B5E] bg-white text-center space-y-3 max-w-md mx-auto">
            <span className="text-3xl">🔍</span>
            <h3 className="text-lg font-black text-[#182B5E] uppercase">No Matching Courses Found</h3>
            <p className="text-xs text-[#5A6B8C] font-semibold">
              Try adjusting your search query or view all available language programs.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary text-xs mt-2"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} index={idx} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
