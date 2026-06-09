import mongoose from 'mongoose';


const quizSchema = new mongoose.Schema({
    courseId: String,
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String
      }
    ]
  });
  
  export default mongoose.model("Quiz", quizSchema);
  