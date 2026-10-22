import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, open = true, onClose, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    dialogRef.current?.querySelector('button')?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') onCloseRef.current?.();
      if (event.key === 'Tab') {
        const focusable = [...(dialogRef.current?.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') || [])];
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus?.(); };
  }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/50 p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose?.(); }}><section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="shared-modal-title" className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-pureWhite p-6 shadow-2xl focus:outline-none ${size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-sm' : 'max-w-xl'}`}><div className="mb-5 flex items-center justify-between"><h2 id="shared-modal-title" className="text-lg font-bold text-charcoal">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md p-1 text-charcoal/50 hover:bg-cloudWhite"><X size={20}/></button></div>{children}{footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}</section></div>;
}
