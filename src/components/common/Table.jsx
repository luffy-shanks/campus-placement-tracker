import React from 'react';

export default function Table({ columns, rows, getRowKey = (row, index) => row.id ?? index, empty = 'No records found.', className = '' }) {
  return <div className={`overflow-x-auto rounded-xl border border-moonlitSilver/70 bg-pureWhite ${className}`}><table className="w-full text-left text-sm"><thead className="bg-cloudWhite text-xs uppercase text-charcoal/55"><tr>{columns.map(column => <th key={column.key} className="px-4 py-3 font-semibold">{column.header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={getRowKey(row, index)} className="border-t border-cloudWhite">{columns.map(column => <td key={column.key} className="px-4 py-3">{column.render ? column.render(row, index) : row[column.key]}</td>)}</tr>) : <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-charcoal/50">{empty}</td></tr>}</tbody></table></div>;
}
