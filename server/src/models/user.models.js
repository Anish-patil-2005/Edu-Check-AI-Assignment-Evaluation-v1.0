import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password : String,
  role: { type: String, enum: ['student', 'teacher'], required: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
