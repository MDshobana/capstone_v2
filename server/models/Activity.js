
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema);
