import React from 'react';

export default function FormError({ children, className = '' }) {
  if (!children) return null;
  return <p className={`mt-1 text-xs text-signalRed ${className}`} role="alert">{children}</p>;
}
