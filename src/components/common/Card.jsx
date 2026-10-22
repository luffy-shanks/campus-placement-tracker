import React from 'react';
import classNames from 'classnames';

export default function Card({ title, description, action, className, children, ...props }) {
  return <section className={classNames('rounded-xl border border-moonlitSilver/70 bg-pureWhite p-5 shadow-sm', className)} {...props}>{(title || action || description) && <div className="mb-4 flex items-start justify-between gap-3"><div>{title && <h2 className="font-semibold text-charcoal">{title}</h2>}{description && <p className="mt-1 text-sm text-charcoal/55">{description}</p>}</div>{action}</div>}{children}</section>;
}
