import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  hint,
  error,
  required = false,
  disabled = false,
  className = '',
  wrapperClassName = '',
  children,
  ...props
}) {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-black uppercase tracking-wider text-[#182B5E] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-[#D9381E]">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none bg-white text-[#182B5E] text-sm font-semibold px-4 py-3 pr-10 transition-all duration-200 outline-none cursor-pointer ${
            error
              ? 'border-2 border-[#D9381E] focus:shadow-[4px_4px_0px_0px_#D9381E]'
              : 'border-2 border-[#182B5E] focus:shadow-[4px_4px_0px_0px_#182B5E] focus:-translate-x-0.5 focus:-translate-y-0.5'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#F1F5F9]' : ''} ${className}`}
          style={{ borderRadius: 0 }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-[#5A6B8C]">
              {placeholder}
            </option>
          )}

          {options && options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="bg-white text-[#182B5E] py-1 font-medium"
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-[#182B5E]">
          <ChevronDown size={18} strokeWidth={2.5} />
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="flex items-center gap-1.5 text-xs font-bold text-[#D9381E] mt-0.5">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${selectId}-hint`} className="text-xs font-semibold text-[#5A6B8C] mt-0.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
