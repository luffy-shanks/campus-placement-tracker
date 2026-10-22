// src/utils/eligibility.js
// Eligibility calculation utility – can be replaced with a backend API call later

/**
 * Checks whether a student is eligible for a given placement drive.
 * Returns { eligible: boolean, reasons: string[] }
 */
export const checkEligibility = (student, drive) => {
  const reasons = [];

  if (!student || !drive) {
    return { eligible: false, reasons: ['Incomplete data'] };
  }

  // Branch check
  if (drive.eligibleBranches && drive.eligibleBranches.length > 0) {
    if (!drive.eligibleBranches.includes(student.department)) {
      reasons.push(`Branch ${student.department} is not eligible. Required: ${drive.eligibleBranches.join(', ')}`);
    }
  }

  // CGPA check
  if (drive.minCGPA !== undefined && student.cgpa < drive.minCGPA) {
    reasons.push(`CGPA ${student.cgpa} is below the minimum ${drive.minCGPA}`);
  }

  // Backlogs check
  if (drive.maxBacklogs !== undefined && student.backlogs > drive.maxBacklogs) {
    reasons.push(`Active backlogs (${student.backlogs}) exceed the maximum allowed (${drive.maxBacklogs})`);
  }

  // Graduation year check
  if (drive.eligibleGradYears && drive.eligibleGradYears.length > 0) {
    if (!drive.eligibleGradYears.includes(student.graduationYear)) {
      reasons.push(`Graduation year ${student.graduationYear} is not eligible. Required: ${drive.eligibleGradYears.join(', ')}`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
};

/**
 * Returns a display label for the eligibility result.
 */
export const getEligibilityLabel = (student, drive) => {
  if (!student || !drive || student.cgpa == null || !student.department || student.graduationYear == null || student.backlogs == null) return 'Profile Incomplete';
  const result = checkEligibility(student, drive);
  return result.eligible ? 'Eligible' : 'Not Eligible';
};

/**
 * Returns Tailwind classes for eligibility badge.
 */
export const getEligibilityClasses = (label) => {
  switch (label) {
    case 'Eligible':
      return 'bg-successGreen/10 text-successGreen border-successGreen/30';
    case 'Not Eligible':
      return 'bg-signalRed/10 text-signalRed border-signalRed/30';
    default:
      return 'bg-amber/10 text-amber border-amber/30';
  }
};
