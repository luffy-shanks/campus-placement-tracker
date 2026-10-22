import React from 'react';
import classNames from 'classnames';
import { getStatusClasses, getStatusLabel } from '../../utils/status';

export default function Badge({ status, children, className = '' }) {
  const classes = status ? getStatusClasses(status) : 'bg-cloudWhite text-charcoal/70';
  return <span className={classNames('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', classes, className)}>{children ?? (status ? getStatusLabel(status) : null)}</span>;
}
