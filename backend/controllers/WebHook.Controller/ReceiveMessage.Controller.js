import axios from 'axios';
import { User, Message, Conversation } from '../../models/index.js';

export const ReceiveMessage = async (req, res) => {
  if (!req.body || !req.body.object) {
    console.error('Invalid webhook payload:', req.body);
    return res.sendStatus(400);
  }

  const { object, entry } = req.body;
  if (object !== 'page') return res.sendStatus(404);

  try {
    for (const ent of entry) {
      const pageId = ent.id;

      for (const ev of ent.messaging) {
        if (ev.message && ev.sender?.id && ev.message.text) {
          const user = await User.findOne({ fbPageId: pageId });
          if (!user || !user.fbPageAccessToken) continue;

          const senderId = ev.sender.id;

          // Get sender name from Graph API
          let senderName = 'Unknown';
          try {
            const graphRes = await axios.get(`https://graph.facebook.com/${senderId}`, {
              params: {
                fields: 'first_name,last_name',
                access_token: user.fbPageAccessToken
              }
            });
            const { first_name, last_name } = graphRes.data;
            senderName = `${first_name} ${last_name}`;
          } catch (err) {
            console.warn('Failed to fetch sender name:', err.message);
          }

          // Find or create conversation
          let convo = await Conversation.findOne({
            participant: senderId,
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          });

          if (!convo) {
            convo = await Conversation.create({
              participant: senderId,
              participantName: senderName,
              createdAt: new Date()
            });
          }

          const msg = await Message.create({
            senderId,
            text: ev.message.text,
            timestamp: new Date(ev.timestamp),
            conversation: convo._id
          });

          convo.messages.push(msg._id);
          await convo.save();
        }
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Error processing webhook message:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
