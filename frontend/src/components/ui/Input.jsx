import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  error,
  required = false,
  disabled = false,
  iconLeading = null,
  iconTrailing = null,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-black uppercase tracking-wider text-[#182B5E] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-[#D9381E]">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {iconLeading && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#5A6B8C]">
            {iconLeading}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full bg-white text-[#182B5E] placeholder-[#5A6B8C]/60 text-sm font-semibold px-4 py-3 transition-all duration-200 outline-none ${
            iconLeading ? 'pl-10' : ''
          } ${iconTrailing || isPassword ? 'pr-11' : ''} ${
            error
              ? 'border-2 border-[#D9381E] focus:shadow-[4px_4px_0px_0px_#D9381E]'
              : 'border-2 border-[#182B5E] focus:shadow-[4px_4px_0px_0px_#182B5E] focus:-translate-x-0.5 focus:-translate-y-0.5'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#F1F5F9]' : ''} ${className}`}
          style={{ borderRadius: 0 }}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            id={`${inputId}-toggle-visibility`}
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-[#5A6B8C] hover:text-[#182B5E] transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : iconTrailing ? (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#5A6B8C]">
            {iconTrailing}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs font-bold text-[#D9381E] mt-0.5">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
