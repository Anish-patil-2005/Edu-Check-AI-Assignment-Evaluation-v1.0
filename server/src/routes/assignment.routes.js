import express from "express";
import { createAssignment, listAssignments, listSubmissions,downloadAssignmentSampleFile } from "../controllers/assignment.controllers.js";
import { isAuth, isTeacher } from "../middleware/auth.middlewares.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); // store uploads in /uploads

const router = express.Router();

router.post("/", isAuth, isTeacher, upload.single("samplefile"), createAssignment);
router.get("/", isAuth,isTeacher ,listAssignments);
router.get("/:assignmentId/submissions", isAuth,isTeacher ,listSubmissions);

router.get("/:assignmentId/sample-file", isAuth, downloadAssignmentSampleFile);


export default router;
