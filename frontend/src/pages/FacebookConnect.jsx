import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Box,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const FacebookConnect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pages, setPages] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [loadingPages, setLoadingPages] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success' | 'error' | 'warning' | 'info'

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    if (code) exchangeCodeForToken(code);
  }, [location]);

  const exchangeCodeForToken = async (code) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/facebook/exchange-token`, {
        code,
      });

      const token = data.accessToken;
      setAccessToken(token);
      fetchPages(token);
    } catch (error) {
      console.error('Token exchange failed:', error.response?.data || error.message);
      showSnackbar('Facebook login failed.', 'error');
    }
  };

  const fetchPages = async (accessToken) => {
    setLoadingPages(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/facebook/pages`, {
        accessToken,
      });

      setPages(response.data.pages || []);
    } catch (error) {
      console.error('Failed to fetch pages:', error.message);
      showSnackbar('Failed to fetch Facebook pages.', 'error');
    } finally {
      setLoadingPages(false);
    }
  };

  const handleConnectClick = () => {
    const appId = import.meta.env.VITE_FB_APP_ID;
    const redirect = import.meta.env.VITE_FB_REDIRECT_URI;
    const scope = 'pages_messaging,pages_show_list,pages_manage_metadata';
    window.location.href = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirect}&scope=${scope}&response_type=code`;
  };

  const connectPage = async (pageId) => {
    const token = localStorage.getItem('token');
    if (!accessToken) return showSnackbar('Access token missing. Please reconnect Facebook.', 'error');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/facebook/oauth`,
        { pageId, accessToken },
        { headers: { token } }
      );

      showSnackbar('Facebook Page connected!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Connection failed:', err.response?.data || err.message);
      showSnackbar('Failed to connect Facebook page.', 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom align="center">
          Connect Facebook Page
        </Typography>

        {!accessToken ? (
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FacebookIcon />}
              onClick={handleConnectClick}
            >
              Connect with Facebook
            </Button>
          </Box>
        ) : loadingPages ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : pages.length > 0 ? (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Select a page to connect:
            </Typography>
            <Stack spacing={2}>
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant="outlined"
                  onClick={() => connectPage(page.id)}
                >
                  {page.name}
                </Button>
              ))}
            </Stack>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center" mt={2}>
            No pages found or not authorized.
          </Typography>
        )}
      </Paper>

      {/* Snackbar
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </Container>
  );
};

export default FacebookConnect;
