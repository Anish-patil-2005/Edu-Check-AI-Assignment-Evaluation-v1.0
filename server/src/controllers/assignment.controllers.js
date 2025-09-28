import {Assignment} from '../models/assignment.models.js';
import Submission from '../models/submission.models.js';
import {z} from 'zod';
import mongoose from 'mongoose';


// teacher creates an assignment

import { extractText } from "../sevices/textExtract.service.js"; // your utility

export const createAssignment = async (req, res) => {
  try {
    const {  title, description, similarityThreshold, dueDate } = req.body;
    let sampleAssignmentText = "";

    const teacherId = req.user.id;

    const assignmentData = {
      teacherId,
      title,
      description,
      similarityThreshold,
      dueDate,
    };

    if (req.file) {
      sampleAssignmentText = await extractText(req.file.path, req.file.mimetype);
      // ✅ Conditionally add file properties
      assignmentData.sampleAssignmentText = sampleAssignmentText;
      assignmentData.sampleFilePath = req.file.path;
      assignmentData.sampleFileOriginalName = req.file.originalname;
    }

    const assignment = new Assignment(assignmentData);
    await assignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("❌ Error in createAssignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};
// Teacher fetch all assignments
export const listAssignments = async (req, res, next) => {
  try {
    const teacherId = req.user.id; // ✅ comes from auth middleware

    // Fetch only assignments belonging to this teacher
    const assignments = await Assignment.find({ teacherId })
      .sort()
      .lean();

    res.json(assignments);
  } catch (err) {
    next(err);
  }
};


// Teacher view submissions for an assignment
export const listSubmissions = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

   // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ error: "Invalid assignmentId" });
    }

    const submissions = await Submission.find({ assignmentId })
      .sort({ createdAt: -1 })
      .populate("studentId", "name email") // uses User model
      .lean();

    res.json(submissions);
  } catch (err) {
    next(err);
  }
};





export const totalSubmissions = async (req, res, next) => {
  try {
    const teacherId = req.user.id; // get teacher ID from auth middleware

    // 1️⃣ Get all assignments for this teacher
    const assignments = await Assignment.find({ teacherId }).lean();

    // 2️⃣ Count submissions for each assignment
    const result = await Promise.all(
      assignments.map(async (assignment) => {
        const count = await Submission.countDocuments({ assignmentId: assignment._id });
        return {
          assignmentId: assignment._id,
          assignmentName: assignment.title, // or assignment.name if your schema uses "name"
          totalSubmissions: count
        };
      })
    );

    // 3️⃣ Send response
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching total submissions:", err);
    next(err);
  }
};


export const downloadAssignmentSampleFile = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId).lean();

    if (!assignment || !assignment.sampleFilePath) {
      return res.status(404).json({ error: "Sample file not found" });
    }
    
    // Serve the file for download
    res.download(assignment.sampleFilePath, assignment.sampleFileOriginalName);

  } catch (error) {
    next(error);
  }
};