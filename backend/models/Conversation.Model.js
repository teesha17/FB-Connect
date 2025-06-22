import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participant: String, // FB user id
  participantName : String,
  profilePic:String,
  createdAt: Date,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});
export const Conversation = mongoose.model('Conversation', ConversationSchema);