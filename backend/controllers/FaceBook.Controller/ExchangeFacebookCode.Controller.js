// controllers/facebookController.js
import axios from 'axios';

export const ExchangeFacebookCode = async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code);
    if (!code) {
      return res.status(400).json({ message: 'Missing code', status: false });
    }

    const { data } = await axios.get('https://graph.facebook.com/v13.0/oauth/access_token', {
      params: {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: process.env.FRONTEND_REDIRECT_URI,
        code
      }
    });

    return res.status(200).json({ accessToken: data.access_token, status: true });
  } catch (err) {
    console.error('Facebook Token Exchange Error:', err.message);
    return res.status(500).json({ message: 'Token exchange failed', status: false, error: err.message });
  }
};
