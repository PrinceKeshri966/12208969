import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Tabs, Tab, Snackbar, Alert, AppBar, Toolbar, Typography } from '@mui/material';
import { Link as LinkIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import URLForm from '../components/URLForm';
import ShortenedUrlResults from '../components/ShortenedUrl';
import StatisticsPage from '../components/StatisticsPage';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateShortcode, getUserAgent, formatDateTime, validateShortcode } from '../utils/helpers';
import { getGeolocation } from '../utils/geolocation';
import { FrontendLogger } from '../../../logging-middleware';

const URLShortenerApp = () => {
  const [shortenedUrls, setShortenedUrls] = useLocalStorage('shortenedUrls', []);
  const [urlMappings, setUrlMappings] = useLocalStorage('urlMappings', {});
  const [currentResults, setCurrentResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    FrontendLogger.page.info('App initialized');
  }, []);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const generateUniqueShortcode = (preferred) => {
    let code = preferred || generateShortcode();
    if (urlMappings[code] || shortenedUrls.some(url => url.shortcode === code)) {
      throw new Error('Shortcode already exists');
    }
    return code;
  };

  const handleUrlSubmit = async (urls) => {
    setIsLoading(true);
    const results = [];
    const newMappings = { ...urlMappings };
    for (const url of urls) {
      try {
        const code = generateUniqueShortcode(url.customShortcode);
        const now = new Date();
        const expiry = new Date(now.getTime() + url.validity * 60000);
        const shortUrl = `http://localhost:3000/${code}`;
        const data = {
          shortcode: code,
          originalUrl: url.originalUrl,
          shortUrl,
          createdAt: now.toISOString(),
          expiryDate: expiry.toISOString(),
          clicks: [],
          validity: url.validity
        };
        results.push(data);
        newMappings[code] = data;
      } catch (err) {
        showSnackbar(err.message, 'error');
      }
    }
    setShortenedUrls(prev => [...prev, ...results]);
    setUrlMappings(newMappings);
    setCurrentResults(results);
    showSnackbar(`${results.length} URL(s) shortened successfully`);
    setIsLoading(false);
  };

  const handleUrlClick = (shortcode, clickData) => {
    setShortenedUrls(prev =>
      prev.map(url =>
        url.shortcode === shortcode ? { ...url, clicks: [...url.clicks, clickData] } : url
      )
    );
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => showSnackbar('Copied!')).catch(() => showSnackbar('Copy failed', 'error'));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <LinkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} variant="fullWidth">
            <Tab label="Shortener" icon={<LinkIcon />} iconPosition="start" />
            <Tab label="Statistics" icon={<AnalyticsIcon />} iconPosition="start" />
          </Tabs>
        </Paper>
        {activeTab === 0 && <><URLForm onSubmit={handleUrlSubmit} isLoading={isLoading} /><ShortenedUrlResults results={currentResults} onCopy={handleCopy} /></>}
        {activeTab === 1 && <StatisticsPage shortenedUrls={shortenedUrls} onUrlClick={handleUrlClick} />}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default URLShortenerApp;

