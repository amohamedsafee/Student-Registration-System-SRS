import React from 'react';
import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';

export default function BatchSelector({
  batches = [],
  selectedBatchId,
  onSelectBatch,
  courseId,
}) {
  if (!batches || batches.length === 0) {
    return (
      <div className="p-8 border-2 border-[#182B5E] bg-[#F7F9FC] text-center space-y-3">
        <span className="text-2xl">⏳</span>
        <h4 className="text-base font-black text-[#182B5E] uppercase">No Open Batches Available</h4>
        <p className="text-xs text-[#5A6B8C] font-semibold max-w-sm mx-auto">
          Admissions for upcoming batches are currently being scheduled. Please check back soon or register your interest with campus administration.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#182B5E]">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#182B5E]">
          Select An Open Intake Batch
        </h3>
        <span className="text-xs font-black text-[#116530] uppercase">
          {batches.length} Open {batches.length === 1 ? 'Batch' : 'Batches'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {batches.map((batch) => {
          const isSelected = selectedBatchId === batch.id;

          return (
            <div
              key={batch.id}
              onClick={() => onSelectBatch && onSelectBatch(batch.id)}
              className={`p-5 border-2 transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#182B5E] bg-[#F7F9FC] shadow-[6px_6px_0px_0px_#182B5E] -translate-x-0.5 -translate-y-0.5'
                  : 'border-[#182B5E] bg-white hover:shadow-[4px_4px_0px_0px_#182B5E] hover:-translate-y-0.5'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-black uppercase text-[#116530] bg-white border border-[#116530] px-1.5 py-0.5">
                  <CheckCircle size={12} />
                  <span>Selected</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-black text-base text-[#182B5E] pr-6">
                    {batch.batch_name}
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-[#5A6B8C]">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#D9381E] shrink-0" />
                    <span>Commences: <strong className="text-[#182B5E]">{formatDate(batch.start_date)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#182B5E] shrink-0" />
                    <span>Schedule: <strong className="text-[#182B5E]">{batch.schedule || 'Flexible'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#CBD5E1] flex items-center justify-between">
                <StatusBadge status="OPEN" size="sm" />
                <a
                  href={`/register?course=${courseId || batch.course_id}&batch=${batch.id}`}
                  className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#D9381E] hover:underline"
                >
                  <span>Register Now</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
