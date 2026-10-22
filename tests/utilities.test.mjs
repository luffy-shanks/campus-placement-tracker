import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const loadSourceModule = async path => {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};

const [{ daysRemaining, formatDate, isPastDate, toDateInputValue }, { getStatusClasses, getStatusLabel }, { checkEligibility, getEligibilityLabel }] = await Promise.all([
  loadSourceModule('../src/utils/date.js'),
  loadSourceModule('../src/utils/status.js'),
  loadSourceModule('../src/utils/eligibility.js'),
]);

test('date helpers format, compare and normalize dates', () => {
  assert.match(formatDate('2025-02-20'), /2025/);
  assert.equal(daysRemaining('2025-01-03', new Date(2025, 0, 1)), 2);
  assert.equal(isPastDate('2024-12-31', new Date(2025, 0, 1)), true);
  assert.equal(toDateInputValue('2025-02-20'), '2025-02-20');
  assert.equal(formatDate('not a date'), '–');
});

test('status helpers map expected labels and classes', () => {
  assert.equal(getStatusLabel('shortlisted'), 'Shortlisted');
  assert.equal(getStatusLabel('not_placed'), 'Not Placed');
  assert.match(getStatusClasses('selected'), /successGreen/);
  assert.match(getStatusClasses('unknown'), /gray/);
});

test('eligibility utility reports pass, fail reasons and incomplete profile', () => {
  const student = { department: 'CSE', cgpa: 8.2, backlogs: 0, graduationYear: 2026 };
  const drive = { eligibleBranches: ['CSE', 'IT'], minCGPA: 7.5, maxBacklogs: 0, eligibleGradYears: [2026] };
  assert.deepEqual(checkEligibility(student, drive), { eligible: true, reasons: [] });
  assert.equal(checkEligibility({ ...student, cgpa: 6.2 }, drive).eligible, false);
  assert.equal(getEligibilityLabel({ department: 'CSE' }, drive), 'Profile Incomplete');
});
