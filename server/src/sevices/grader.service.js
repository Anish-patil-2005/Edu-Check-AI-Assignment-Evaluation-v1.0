export function gradeFromPeerSimilarity(s) {
  if (s > 75) return { grade: 'C', marks: 7 };
  if (s >= 50) return { grade: 'B', marks: 12 };
  if (s >= 25) return { grade: 'A', marks: 18 };
  return { grade: 'A+', marks: 20 };
}

