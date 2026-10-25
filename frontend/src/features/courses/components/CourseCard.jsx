import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import { ArrowRight } from 'lucide-react';

const STRIPES = ['#D9381E', '#116530', '#F28C28'];

export default function CourseCard({ course, index = 0 }) {
  const stripeColor = STRIPES[index % STRIPES.length];
  const shortCode = (course.name || '').substring(0, 2).toUpperCase();

  return (
    <div className="bg-white border-[3px] border-[#182B5E] p-6 relative flex flex-col justify-between hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#182B5E] transition-all duration-200 group">
      {/* Top Accent Stripe */}
      <div
        className="h-2 absolute -top-[3px] -left-[3px] -right-[3px]"
        style={{ backgroundColor: stripeColor }}
      />

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 border-2 border-[#182B5E] bg-[#F1F5F9] flex items-center justify-center font-black text-sm text-[#182B5E]">
            {shortCode}
          </div>
          <StatusBadge
            status={course.is_active ? 'OPEN' : 'CLOSED'}
            size="sm"
          />
        </div>

        <div>
          <h3 className="text-xl font-black text-[#182B5E] group-hover:text-[#D9381E] transition-colors leading-snug">
            {course.name}
          </h3>
          <p className="text-xs text-[#5A6B8C] font-semibold mt-2 line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        <dl className="pt-3 border-t-2 border-[#182B5E] space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="text-[#5A6B8C] font-bold">Duration</dt>
            <dd className="text-[#182B5E] font-black">{course.duration || 'Flexible'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#5A6B8C] font-bold">Open Batches</dt>
            <dd className="text-[#182B5E] font-black">
              {course.open_batches_count !== undefined ? `${course.open_batches_count} Available` : 'Check Batches'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 pt-4 border-t border-[#CBD5E1] flex gap-2">
        <Link to={`/courses/${course.id}`} className="flex-1">
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
          >
            Details
          </Button>
        </Link>
        <Link to={`/register?course=${course.id}`} className="flex-1">
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs"
            iconTrailing={<ArrowRight size={13} />}
          >
            Apply
          </Button>
        </Link>
      </div>
    </div>
  );
}
