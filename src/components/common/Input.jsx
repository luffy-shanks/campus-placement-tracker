import React from 'react';
import classNames from 'classnames';

export default function Input({ label, error, id, className, ...props }) {
  const inputId = id || props.name;
  return <div className="w-full"><>{label && <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>}<input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} className={classNames('w-full rounded-lg border bg-pureWhite px-3 py-2 text-sm text-charcoal outline-none transition focus:ring-2', error ? 'border-signalRed focus:border-signalRed focus:ring-signalRed/15' : 'border-moonlitSilver/80 focus:border-cobaltBlue focus:ring-cobaltBlue/15', className)} {...props}/>{error && <p id={`${inputId}-error`} className="mt-1 text-xs text-signalRed" role="alert">{error}</p>}</></div>;
}
