import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox, action }) {
  return <div className="rounded-xl border border-dashed border-moonlitSilver bg-pureWhite px-6 py-12 text-center"><Icon size={30} className="mx-auto mb-3 text-charcoal/35"/><h3 className="font-semibold text-charcoal">{title}</h3>{description && <p className="mx-auto mt-1 max-w-md text-sm text-charcoal/55">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>;
}
