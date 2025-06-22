import { Conversation } from '../../models/index.js';

export const GetAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({})
      .populate('messages')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: 'Conversations fetched successfully',
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};
