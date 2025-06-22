// controllers/facebookController.js
import axios from "axios";

export const GetFacebookPages = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ status: false, message: 'Missing access token' });
    }

    const { data } = await axios.get('https://graph.facebook.com/v13.0/me/accounts', {
      params: { access_token: accessToken },
    });

    return res.status(200).json({ status: true, pages: data.data });
  } catch (err) {
    console.error('Error fetching Facebook pages:', err.message);
    return res.status(500).json({ status: false, message: 'Failed to fetch pages', error: err.message });
  }
};
