import React from 'react';
import Button from './Button';

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;
  return <nav className="mt-4 flex items-center justify-between" aria-label="Pagination"><span className="text-sm text-charcoal/55">Page {page} of {pageCount}</span><div className="flex gap-2"><Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button><Button variant="secondary" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Next</Button></div></nav>;
}
