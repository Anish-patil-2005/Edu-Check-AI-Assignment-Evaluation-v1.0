import axios from "axios";
import { Assignment } from "../models/assignment.models.js";

const { PY_AI_URL, DEFAULT_THRESHOLD = 75 } = process.env;

export const checkWith = async ({ studentText, allAssignments, teacherText, threshold }) => {
  const url = "http://127.0.0.1:5000/check-assignment";


  const payload = {
    studentText,
    allAssignments: allAssignments || [],
    teacherText, // fallback to empty string
    threshold: typeof threshold === "number" ? threshold : Number(DEFAULT_THRESHOLD),
  };

  const res = await axios.post(url, payload, { timeout: 30_000 });
  return res.data; // { status, similarityWithStudents, similarityWithTeacher }
};
