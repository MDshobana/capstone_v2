import mongoose from 'mongoose';
const submissionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    fileUrl: String,

 
    marks: Number,
    feedback: String,

    status: {
        type: String,
        default: "submitted" 
    },
    assignmentName: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("Submission", submissionSchema);