import React from 'react';

const SIZES = {
  xs: 'w-3.5 h-3.5 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-[3px]',
  lg: 'w-8 h-8 border-4',
  xl: 'w-12 h-12 border-4',
};

const VARIANTS = {
  navy: 'border-[#182B5E] border-t-transparent',
  white: 'border-white border-t-transparent',
  red: 'border-[#D9381E] border-t-transparent',
  green: 'border-[#116530] border-t-transparent',
  orange: 'border-[#F28C28] border-t-transparent',
  current: 'border-current border-t-transparent',
};

export default function Spinner({
  size = 'md',
  variant = 'navy',
  className = '',
  label = 'Loading...',
}) {
  const sizeClasses = SIZES[size] || SIZES.md;
  const variantClasses = VARIANTS[variant] || VARIANTS.navy;

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className={`animate-spin ${sizeClasses} ${variantClasses} rounded-full`}
        style={{ borderRadius: '50%' }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
