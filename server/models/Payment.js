
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentId: String,        // Stripe / Razorpay payment ID
  orderId: String,          // Razorpay orderId (if used)
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
