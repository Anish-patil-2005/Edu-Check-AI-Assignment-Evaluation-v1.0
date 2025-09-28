import Submission from '../models/submission.models.js'

import {Assignment} from '../models/assignment.models.js'

import { extractText } from '../sevices/textExtract.service.js'

import { checkWith } from '../sevices/aiClient.service.js'

import { gradeFromTeacherSimilarity } from '../sevices/grader.service.js'

import {z} from 'zod';

/**
 * Upload a student submission
 * - Reject if similarity > assignment threshold
 * - Assign grade automatically
 */


export const uploadSubmission = async (req, res, next) => {
  try {
    // ✅ Parse input using Zod
    const schema = z.object({
      assignmentId: z.string().min(1, "assignmentId required"),
    });


    const parsed = schema.safeParse({ assignmentId: req.body.assignmentId });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const studentId = req.user.id;
    const { assignmentId } = parsed.data;

    // ✅ Ensure file exists
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    // ✅ Extract text from uploaded file
    const text = await extractText(file.path, file.mimetype);

    // ✅ Fetch assignment info
    const assignment = await Assignment.findById(assignmentId).lean();
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }    

    const teacherText = await assignment.sampleAssignmentText;

    const threshold =  assignment.similarityThreshold || 75;

    // ✅ Fetch all previously accepted submissions
    const previousSubs = await Submission.find({
      assignmentId,
      status: "accepted",
    }).lean();

    const allTexts = previousSubs.map((s) => s.text);

    // ✅ AI Microservice check
    const aiResult = await checkWith({
      studentText: text,
      allAssignments: allTexts,
      teacherText,
      threshold,
    });

    

    // ❌ If rejected
    if (aiResult.status === "rejected") {
      const rejected = await Submission.create({
        studentId,
        assignmentId,
        originalFilename: file.originalname,
        storedPath: file.path,
        mimeType: file.mimetype,
        size: file.size,
        text,
        status: "rejected",
        rejectedReason:
          aiResult.reason || `Similarity exceeded ${threshold}%`,
      });

      return res.json({
        status: "rejected",
        reason: rejected.rejectedReason,
      });
    }

    // ✅ If accepted
    const peer = aiResult.similarityWithStudents ?? 0;
    const teacherSim = aiResult.similarityWithTeacher  ?? 0;

    const { grade, marks } =
      aiResult.grade && aiResult.marks
        ? { grade: aiResult.grade, marks: aiResult.marks }
        : gradeFromTeacherSimilarity(teacherSim);

    const saved = await Submission.create({
      studentId,
      assignmentId,
      originalFilename: file.originalname,
      storedPath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      text,
      peerSimilarity: Number(peer.toFixed(2)),
      teacherSimilarity: Number(teacherSim.toFixed(2)),
      grade,
      marks,
      status: "accepted",
    });

    res.json({
      status: "accepted",
      peer_similarity: saved.peerSimilarity,
      teacher_similarity: saved.teacherSimilarity,
      grade: saved.grade,
      marks: saved.marks,
    });
  } catch (error) {
    console.error("Error in uploadSubmission:", error);
    next(error);
  }
};


/**
 * List all submissions by a student
 */

export const listStudentSubmissions = async (req, res, next) => {
  try {
    const studentId  = req.user.id;
    const submissions = await Submission.find({ studentId })
      .sort({ createdAt: -1 })
      .populate('assignmentId', '_id title teacherId dueDate description')
      .lean();
    res.json(submissions);
  } catch (err) {
    next(err);
  }
};


export const listAssignmentsForStudents = async (req, res, next) => {
  try {
    // Fetch all assignments (optionally filter by active/available)
    const assignments = await Assignment.find()
      .populate("teacherId", "name") // only title) // get teacher name
      .sort({ dueDate: 1 })
      .lean();

    res.json(assignments);
  } catch (err) {
    next(err);
  }
};



export const totalSubmissions = async (req, res, next) => {
  try {
    const teacherId = req.user?.id; // teacher ID from auth middleware
    if (!teacherId) return res.status(401).json({ message: "Unauthorized" });

    // 1️⃣ Get all assignments for this teacher
    const assignments = await Assignment.find({ teacherId }).lean();

    // 2️⃣ Count submissions for each assignment
    const result = await Promise.all(
      assignments.map(async (assignment) => {
        const count = await Submission.countDocuments({ assignmentId: assignment._id });
        return {
          assignmentId: assignment._id,
          assignmentName: assignment.title,
          totalSubmissions: count,
        };
      })
    );

    // 3️⃣ Send array of objects
    res.json(result);

  } catch (error) {
    console.error("Error in totalSubmissions:", error);
    next(error);
  }
};

export const downloadSubmissionFile = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    
    // You could add extra authorization here to ensure the teacher
    // is allowed to see this submission.
    
    const submission = await Submission.findById(submissionId).lean();

    if (!submission || !submission.storedPath) {
      return res.status(404).json({ error: "File not found" });
    }
    
    // Securely send the file for download
    res.download(submission.storedPath, submission.originalFilename);

  } catch (error) {
    next(error);
  }
};