const STATUS_STYLES = {
  applied: 'bg-cobaltBlue/10 text-cobaltBlue',
  shortlisted: 'bg-amber/15 text-amber-800',
  assessment: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber/15 text-amber-800',
  selected: 'bg-successGreen/10 text-successGreen',
  rejected: 'bg-signalRed/10 text-signalRed',
  open: 'bg-successGreen/10 text-successGreen',
  closed: 'bg-gray-100 text-gray-600',
  draft: 'bg-gray-100 text-gray-600',
};

export const getStatusClasses = status => STATUS_STYLES[String(status || '').toLowerCase()] || 'bg-gray-100 text-gray-600';
export const getStatusLabel = status => String(status || '').replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
