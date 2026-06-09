import mongoose from 'mongoose';
const progressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    fileUrl: String,
    marks: Number, 
    feedback: String, 
    submittedAt: Date
  });
  
export default mongoose.model("Progress", progressSchema);