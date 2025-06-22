import axios from 'axios';
import { User, Message, Conversation } from '../../models/index.js';

export const ReplyMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const userId = req.userId;
    console.log(req.body)

    if (!conversationId || !text || !userId) {
      return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user || !user.fbPageAccessToken) {
      return res.status(403).json({ status: false, message: 'No Facebook page connected' });
    }

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ status: false, message: 'Conversation not found' });

    const to = convo.participant;

    await axios.post(
      `https://graph.facebook.com/v13.0/me/messages`,
      {
        recipient: { id: to },
        message: { text }
      },
      {
        params: { access_token: user.fbPageAccessToken }
      }
    );

    const msg = await Message.create({
      senderId: 'PAGE',
      text,
      timestamp: new Date(),
      conversation: convo._id
    });

    convo.messages.push(msg._id);
    await convo.save();

    return res.status(200).json({ status: true, message: 'Reply sent successfully' });
  } catch (err) {
    console.error('Reply Error:', err.message);
    return res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
  }
};
