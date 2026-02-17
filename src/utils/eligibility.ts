import type { Student, DriveCriteria, EligibilityDetail, EligibilityResult } from '../types';

/**
 * Detailed eligibility engine comparing Student Profile against Drive Criteria.
 * Returns boolean and array of detailed reasons.
 */
export const checkEligibility = (student: Student, criteria: DriveCriteria): EligibilityResult => {
    const checks: EligibilityDetail[] = [];

    // 1. CGPA Check
    if (student.cgpa >= criteria.minCgpa) {
        checks.push({
            passed: true,
            reason: `Your CGPA ${student.cgpa} meets the minimum requirement of ${criteria.minCgpa}.`
        });
    } else {
        checks.push({
            passed: false,
            reason: `Your CGPA of ${student.cgpa} is below the required ${criteria.minCgpa}.`
        });
    }

    // 2. Backlogs Check
    if (student.backlogs <= criteria.maxBacklogs) {
        checks.push({
            passed: true,
            reason: `You have ${student.backlogs} backlogs (Allowed: ≤${criteria.maxBacklogs}).`
        });
    } else {
        checks.push({
            passed: false,
            reason: `You have ${student.backlogs} backlogs, which exceeds the limit of ${criteria.maxBacklogs}.`
        });
    }

    // 3. Branch Check
    if (criteria.allowedBranches.includes(student.branch)) {
        checks.push({
            passed: true,
            reason: `Your branch (${student.branch}) is eligible.`
        });
    } else {
        checks.push({
            passed: false,
            reason: `Only [${criteria.allowedBranches.join(', ')}] branches are eligible. Your branch is ${student.branch}.`
        });
    }

    // 4. Graduation Year Check (Optional but good for strict matching)
    if (criteria.eligibleGraduationYears && criteria.eligibleGraduationYears.length > 0) {
        if (criteria.eligibleGraduationYears.includes(student.graduationYear)) {
            checks.push({ passed: true, reason: `Graduation Year ${student.graduationYear} is eligible.` });
        } else {
            checks.push({ passed: false, reason: `Only ${criteria.eligibleGraduationYears.join(', ')} batches are eligible. You graduate in ${student.graduationYear}.` });
        }
    }

    const isEligible = checks.every(check => check.passed);

    return { isEligible, checks };
};
