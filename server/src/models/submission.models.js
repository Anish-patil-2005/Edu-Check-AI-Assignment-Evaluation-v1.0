import mongoose from 'mongoose';
import { string } from 'zod';

const { Schema, model, Types } = mongoose;

const submissionSchema = new Schema({
  assignmentId: { type: Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Types.ObjectId, ref: 'User', required: true },
  originalFilename: String,
  storedPath: String,
  mimeType: String,
  size: Number,
  text: String, // extracted text
  peerSimilarity: Number,       // % with other students
  teacherSimilarity: Number,    // % with teacher sample
  grade: string,
  marks: Number,
  status: { type: String, enum: ['accepted', 'rejected'], required: true },
  rejectedReason: String
}, { timestamps: true });

export default model('Submission', submissionSchema);
