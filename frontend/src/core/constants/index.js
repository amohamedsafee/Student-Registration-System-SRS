/**
 * Core application constants
 */

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

export const REGISTRATION_STATUSES = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const STATUS_CONFIG = {
  [REGISTRATION_STATUSES.PENDING]: {
    label: 'Pending Review',
    variant: 'warning',
    color: 'amber',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-400',
    description: 'Application submitted and awaiting initial staff review',
  },
  [REGISTRATION_STATUSES.UNDER_REVIEW]: {
    label: 'Under Review',
    variant: 'info',
    color: 'blue',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-400',
    description: 'An administrator is currently reviewing the submission',
  },
  [REGISTRATION_STATUSES.CONFIRMED]: {
    label: 'Confirmed',
    variant: 'success',
    color: 'emerald',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-400',
    description: 'Registration accepted and student is enrolled in the batch',
  },
  [REGISTRATION_STATUSES.REJECTED]: {
    label: 'Rejected',
    variant: 'danger',
    color: 'rose',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dotClass: 'bg-rose-400',
    description: 'Application was declined. Please contact administration.',
  },
  [REGISTRATION_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    variant: 'neutral',
    color: 'slate',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dotClass: 'bg-slate-400',
    description: 'Registration was cancelled by student or admin',
  },
};

export const CAMPUS_INFO = {
  name: 'Language Learning Campus (LLC)',
  shortName: 'LLC Kalmunai',
  tagline: 'Empowering Futures Through Language Excellence',
  address: 'Main Street, Kalmunai, Eastern Province, Sri Lanka',
  phone: '+94 67 222 9800',
  hotline: '+94 77 123 4567',
  email: 'info@llc.edu.lk',
  admissionEmail: 'admissions@llc.edu.lk',
};
