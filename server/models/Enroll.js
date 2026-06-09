import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    userId: String,
    courseId:String,
    isEnrolled: Boolean,
    createdAt: {
        type: Date,
        default:Date.now()
    }
});

export default mongoose.model("Enrollment", enrollmentSchema);