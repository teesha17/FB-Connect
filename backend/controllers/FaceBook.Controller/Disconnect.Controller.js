import { User } from "../../models/index.js";

export const Disconnect = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    user.fbPageId = null;
    user.fbPageAccessToken = null;
    await user.save();

    return res.status(200).json({
      status: true,
      message: 'Facebook page disconnected successfully'
    });
  } catch (error) {
    console.error('Facebook Disconnect Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Error disconnecting Facebook page',
      error: error.message
    });
  }
};
