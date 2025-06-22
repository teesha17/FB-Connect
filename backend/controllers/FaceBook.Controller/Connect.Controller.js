import axios from 'axios';
import { User } from '../../models/index.js';

export const Connect = async (req, res) => {
  try {
    const { accessToken, pageId } = req.body;

    if (!accessToken || !pageId) {
      return res.status(400).json({ status: false, message: 'Missing code or pageId' });
    }

    console.log("FB_APP_ID", process.env.FB_APP_ID);
console.log("FB_APP_SECRET", process.env.FB_APP_SECRET);
console.log("REDIRECT_URI", process.env.FRONTEND_REDIRECT_URI);


    const user = await User.findById(req.userId);
    console.log("user",user)
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const pageResp = await axios.get(
      `https://graph.facebook.com/v13.0/me/accounts`,
      { params: { access_token: accessToken } }
    );

   console.log("page response",pageResp.data.data);

    const page = pageResp.data.data.find((p) => p.id === pageId);
    if (!page) {
      return res.status(403).json({ status: false, message: 'Specified page not found or not managed by user' });
    }
    console.log("page",page);

    user.fbPageId = page.id;
    user.fbPageAccessToken = page.access_token;
    await user.save();
    console.log("here")

    return res.status(200).json({
      status: true,
      message: 'Page connected successfully',
      data: { pageId: page.id }
    });
  } catch (error) {
    console.error('Facebook OAuth Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Error connecting Facebook page',
      error: error.message
    });
  }
};
