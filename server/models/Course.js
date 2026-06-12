import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: String
});

const courseSchema = new mongoose.Schema({

    title: String,
    description: String,
    category: String,
    level: String,
    thumbnail: String,   // ✅ IMAGE URL
    video: String,       // ✅ VIDEO URL
    lessons: [lessonSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },

    price: {
        type: Number,
        required: true,
        default: 10
    }


});

export default mongoose.model("Course", courseSchema, 'course');