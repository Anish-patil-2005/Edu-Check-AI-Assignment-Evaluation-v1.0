import express from "express";
import multer from "multer";
import { uploadSubmission, listStudentSubmissions, totalSubmissions, listAssignmentsForStudents ,downloadSubmissionFile} from "../controllers/submission.controllers.js";
import { isAuth, isStudent, isTeacher } from "../middleware/auth.middlewares.js";

const upload = multer({ dest: "uploads/" }); // store uploads in /uploads

const router = express.Router();

router.post(
  "/",
  upload.single("submissionFile"), // match frontend FormData key
  isAuth,
  isStudent,
  uploadSubmission
);

router.get(
  "/student/:studentId",
  isAuth,
  isStudent,
  listStudentSubmissions
);

router.get(
  "/student",
  isAuth,
  isStudent,
  listAssignmentsForStudents
);

router.get(
  "/total",
  isAuth,
  isTeacher,
  totalSubmissions
);

router.get(
  "/:submissionId/file",
  isAuth,
  isTeacher,
  downloadSubmissionFile
);


export default router;
