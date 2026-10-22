import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ title = 'Something went wrong', message, onRetry }) {
  return <div className="flex items-start gap-3 rounded-xl border border-signalRed/20 bg-signalRed/5 p-4 text-signalRed" role="alert"><AlertCircle size={18} className="mt-0.5 shrink-0"/><div className="flex-1"><p className="text-sm font-semibold">{title}</p>{message && <p className="mt-1 text-sm">{message}</p>}</div>{onRetry && <button type="button" onClick={onRetry} className="text-sm font-semibold underline">Retry</button>}</div>;
}
