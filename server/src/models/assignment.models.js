import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  sampleAssignmentText: { type: String, default: '' },
  similarityThreshold: { type: Number, default: 75 },
  dueDate: Date
},{ timestamps: true }) ;

export const Assignment = mongoose.model('Assignment',assignmentSchema);