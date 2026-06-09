import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  companyId: String,
  status:{
    type:String,
    enum:["available", "unavailable"],
    default:"available"
  }
});

  
  export default mongoose.model("Job", jobSchema);  