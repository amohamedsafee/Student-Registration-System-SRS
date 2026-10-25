import React from 'react';
import { REGISTRATION_STATUSES } from '../../core/constants';

const STATUS_CLASS_MAP = {
  [REGISTRATION_STATUSES.PENDING]: {
    className: 'badge-pending',
    label: 'Pending',
  },
  [REGISTRATION_STATUSES.UNDER_REVIEW]: {
    className: 'badge-under-review',
    label: 'Under Review',
  },
  [REGISTRATION_STATUSES.CONFIRMED]: {
    className: 'badge-confirmed',
    label: 'Confirmed',
  },
  [REGISTRATION_STATUSES.REJECTED]: {
    className: 'badge-rejected',
    label: 'Rejected',
  },
  [REGISTRATION_STATUSES.CANCELLED]: {
    className: 'badge-cancelled',
    label: 'Cancelled',
  },
  OPEN: {
    className: 'badge-open',
    label: 'Open',
  },
  CLOSED: {
    className: 'badge-closed',
    label: 'Closed',
  },
  ACTIVE: {
    className: 'badge-confirmed',
    label: 'Active',
  },
  INACTIVE: {
    className: 'badge-cancelled',
    label: 'Inactive',
  },
};

export default function StatusBadge({
  status = 'PENDING',
  size = 'md',
  className = '',
}) {
  const normalized = (status || '').toUpperCase();
  const config = STATUS_CLASS_MAP[normalized] || {
    className: 'badge-cancelled',
    label: status,
  };

  const sizeStyles =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-4 py-1.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`${config.className} ${sizeStyles} ${className} font-black tracking-wider uppercase select-none`}
      style={{ borderRadius: 0 }}
      title={config.label}
    >
      {config.label}
    </span>
  );
}
