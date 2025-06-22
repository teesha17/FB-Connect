import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: String,
  text: String,
  timestamp: Date,
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }
});
export const Message = mongoose.model('Message', MessageSchema);