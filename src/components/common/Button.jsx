import React from 'react';
import classNames from 'classnames';

const styles = {
  primary: 'bg-cobaltBlue text-white hover:bg-cobaltBlue/90 focus-visible:ring-cobaltBlue',
  secondary: 'border border-moonlitSilver bg-white text-charcoal hover:bg-cloudWhite focus-visible:ring-cobaltBlue',
  danger: 'bg-signalRed text-white hover:bg-signalRed/90 focus-visible:ring-signalRed',
  ghost: 'text-charcoal hover:bg-cloudWhite focus-visible:ring-cobaltBlue',
};

export default function Button({ variant = 'primary', size = 'md', loading = false, className, disabled, children, ...props }) {
  return <button className={classNames('inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60', styles[variant] || styles.primary, size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm', className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"/>}{children}</button>;
}
