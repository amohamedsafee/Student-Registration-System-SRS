import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer = null,
  size = 'md',
  closeOnBackdropClick = true,
  id = 'llc-modal',
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#182B5E]/60 backdrop-blur-sm transition-opacity"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${sizeClass} bg-white border-[3px] border-[#182B5E] shadow-[12px_12px_0px_0px_#182B5E] p-6 sm:p-8 z-10 my-8`}
        style={{ borderRadius: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-[#182B5E]">
          <div>
            {title && (
              <h2 id={`${id}-title`} className="text-xl sm:text-2xl font-black text-[#182B5E] tracking-tight uppercase">
                {title}
              </h2>
            )}
            {description && (
              <p id={`${id}-desc`} className="text-xs sm:text-sm text-[#5A6B8C] font-semibold mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            id={`${id}-close-button`}
            onClick={onClose}
            className="p-1.5 border-2 border-[#182B5E] text-[#182B5E] hover:bg-[#D9381E] hover:text-white hover:border-[#D9381E] transition-colors focus:outline-none"
            aria-label="Close dialog"
            style={{ borderRadius: 0 }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 text-[#182B5E] text-sm max-h-[65vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer Actions */}
        {footer && (
          <div className="pt-4 border-t-2 border-[#182B5E] flex items-center justify-end gap-3 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
