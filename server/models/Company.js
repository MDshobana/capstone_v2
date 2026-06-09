import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "company" }
  });
  
  export default mongoose.model("Company", companySchema);  