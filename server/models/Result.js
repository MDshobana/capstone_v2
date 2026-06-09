import mongoose from 'mongoose';



const resultSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    score: Number,
    passed: Boolean
  });
  
  export default mongoose.model("Result", resultSchema);
  
  