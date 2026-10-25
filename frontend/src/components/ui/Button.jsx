import React from 'react';
import Spinner from './Spinner';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  'sm-solid': 'btn-sm-solid',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
  warning: 'btn-warning',
};

const SIZES = {
  sm: 'text-xs py-2 px-3.5',
  md: 'text-sm py-3 px-6',
  lg: 'text-base py-4 px-8',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconLeading = null,
  iconTrailing = null,
  className = '',
  type = 'button',
  onClick,
  id,
  ...props
}) {
  const variantClass = VARIANTS[variant] || 'btn-primary';
  const sizeClass = SIZES[size] || SIZES.md;
  const isDisabled = disabled || isLoading;

  return (
    <button
      id={id}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-black uppercase tracking-wider transition-all duration-200 select-none ${
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:translate-x-0 active:translate-y-0'
      } ${variantClass} ${sizeClass} ${className}`}
      style={{ borderRadius: 0 }}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" variant={variant === 'warning' || variant === 'ghost' ? 'navy' : 'white'} className="mr-2" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {iconLeading && <span className="inline-flex shrink-0 mr-2">{iconLeading}</span>}
          <span>{children}</span>
          {iconTrailing && <span className="inline-flex shrink-0 ml-2">{iconTrailing}</span>}
        </>
      )}
    </button>
  );
}
