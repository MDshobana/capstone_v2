import mongoose from "mongoose";


const applicationSchema = new mongoose.Schema({
  jobId: String, 
  studentId: String,
  resumeUrl: String,
  email:String,
  status: { type: String, default: "applied" }
});

  export default mongoose.model("Application", applicationSchema);  