export function gradeFromTeacherSimilarity(s) {
  // Ensure the similarity score 's' is within the 0-100 range.
  const similarityScore = Math.max(0, Math.min(s, 100));

  // 1. Calculate marks dynamically on a scale of 0 to 20.
  // This makes the marks directly proportional to the similarity score.
  const marks = (similarityScore / 100) * 20;

  // 2. Determine the grade based on the dynamically calculated marks.
  let grade;
  if (marks >= 18) {        // 90% and above
    grade = 'A+';
  } else if (marks >= 16) { // 80% to 89.9%
    grade = 'A';
  } else if (marks >= 12) { // 60% to 79.9%
    grade = 'B';
  } else if (marks >= 8) {  // 40% to 59.9%
    grade = 'C';
  } else {                  // Below 40%
    grade = 'D';
  }

  // Return the grade and the precise, calculated marks.
  // We round to two decimal places for cleanliness.
  return { grade: grade, marks: parseFloat(marks.toFixed(2)) };
}


// export function gradeFromTeacherSimilarity(s) {
//   if (s > 75) return { grade: 'A+', marks: 20 };
//   if (s >= 50) return { grade: 'A', marks: 18 };
//   if (s >= 25) return { grade: 'B', marks: 15 };
//   return { grade: 'C', marks: 10 };
// }

