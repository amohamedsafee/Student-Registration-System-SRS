import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, StatusBadge } from '../components/ui';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';

export default function Courses() {
  const courses = [
    {
      id: 'dip-eng',
      stripeColor: '#D9381E',
      code: 'EN',
      name: 'Diploma in English & Communication Skills',
      duration: '6 Months',
      schedule: 'Weekend Morning (Sat/Sun 8:30 AM)',
      description: 'Comprehensive 6-month diploma covering English grammar, vocabulary, business writing, public speaking, and presentation skills designed for higher education and career advancement.',
      status: 'OPEN',
      batch: 'Batch 2026-A',
    },
    {
      id: 'spoken-eng',
      stripeColor: '#116530',
      code: 'SP',
      name: 'Spoken English & Fluency Workshop',
      duration: '3 Months',
      schedule: 'Weekday Evening (Tue/Thu 5:00 PM)',
      description: 'An interactive speaking-intensive program focusing on pronunciation, accent reduction, conversational confidence, everyday dialogues, and group discussions.',
      status: 'OPEN',
      batch: 'Batch 2026-B',
    },
    {
      id: 'ielts',
      stripeColor: '#F28C28',
      code: 'IE',
      name: 'IELTS Academic & General Training Masterclass',
      duration: '2 Months',
      schedule: 'Fast Track (Mon-Thu 6:00 PM)',
      description: 'Targeted test preparation for IELTS candidates aiming for Band 7.0+. Thorough training in Listening, Reading, Academic Writing, and 1-on-1 Mock Speaking.',
      status: 'OPEN',
      batch: 'Batch 2026-FastTrack',
    },
    {
      id: 'sinhala',
      stripeColor: '#D9381E',
      code: 'SI',
      name: 'Sinhala for Everyday Communication',
      duration: '3 Months',
      schedule: 'Fridays 3:00 PM - 6:00 PM',
      description: 'Practical spoken and written Sinhala course designed for professionals, students, and community members in the Eastern Province to communicate effectively.',
      status: 'OPEN',
      batch: 'Batch 2026-A',
    },
    {
      id: 'tamil',
      stripeColor: '#116530',
      code: 'TA',
      name: 'Tamil Language & Literacy for Beginners',
      duration: '3 Months',
      schedule: 'Saturdays 9:00 AM - 12:00 PM',
      description: 'Foundational Tamil course covering alphabet script, essential spoken phrases, and day-to-day conversation skills in local and professional settings.',
      status: 'OPEN',
      batch: 'Batch 2026-A',
    },
    {
      id: 'biz-eng',
      stripeColor: '#F28C28',
      code: 'BZ',
      name: 'Business English & Workplace Communication',
      duration: '6 Weeks',
      schedule: 'Wed & Fri 6:30 PM - 8:30 PM',
      description: 'Tailored for working executives, accountants, and IT professionals: business email etiquette, negotiations, report writing, and meeting moderation.',
      status: 'OPEN',
      batch: 'Batch 2026-Executive',
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="eyebrow">
            Academic Year 2026 Admissions
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#182B5E]">
            All Campus <em>Language Programs</em>
          </h1>
          <p className="text-base sm:text-lg text-[#5A6B8C] font-semibold">
            Choose your language discipline and pick an open batch. Seats are allocated on a first-come basis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border-[3px] border-[#182B5E] p-6 relative flex flex-col justify-between hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#182B5E] transition-all duration-200 group"
            >
              {/* Colored top stripe */}
              <div
                className="h-2 absolute -top-[3px] -left-[3px] -right-[3px]"
                style={{ backgroundColor: course.stripeColor }}
              />

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 border-2 border-[#182B5E] bg-[#F1F5F9] flex items-center justify-center font-black text-sm text-[#182B5E]">
                    {course.code}
                  </div>
                  <StatusBadge status={course.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#182B5E] group-hover:text-[#D9381E] transition-colors leading-snug">
                    {course.name}
                  </h3>
                  <p className="text-xs text-[#5A6B8C] font-semibold mt-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <dl className="pt-3 border-t-2 border-[#182B5E] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-[#5A6B8C] font-bold">Duration</dt>
                    <dd className="text-[#182B5E] font-black">{course.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5A6B8C] font-bold">Schedule</dt>
                    <dd className="text-[#182B5E] font-black">{course.schedule}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5A6B8C] font-bold">Open Batch</dt>
                    <dd className="text-[#182B5E] font-black">{course.batch}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 border-t border-[#CBD5E1]">
                <Link to="/register" className="block">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    iconTrailing={<ArrowRight size={14} />}
                  >
                    Register for Batch
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
