import React, { useState } from 'react';
import { Typography, Card, CardContent, Box, Grid, TextField, IconButton, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Link as LinkIcon } from '@mui/icons-material';
import { FrontendLogger } from '../../../logging-middleware';
import { validateShortcode, validateUrl } from '../utils/helpers';

const URLForm = ({ onSubmit, isLoading }) => {
  const [urls, setUrls] = useState([{ originalUrl: '', validity: 30, customShortcode: '', error: '' }]);

  const addUrlField = () => urls.length < 5 && setUrls([...urls, { originalUrl: '', validity: 30, customShortcode: '', error: '' }]);
  const removeUrlField = (index) => setUrls(urls.filter((_, i) => i !== index));
  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    newUrls[index].error = '';
    setUrls(newUrls);
  };

  const validateForm = () => {
    const newUrls = [...urls];
    let isValid = true;
    newUrls.forEach((url, index) => {
      if (!url.originalUrl.trim()) {
        newUrls[index].error = 'URL is required';
        isValid = false;
      } else if (!validateUrl(url.originalUrl)) {
        newUrls[index].error = 'Invalid URL format';
        isValid = false;
      } else if (url.customShortcode && !validateShortcode(url.customShortcode)) {
        newUrls[index].error = 'Invalid shortcode (alphanumeric, max 20 chars)';
        isValid = false;
      } else if (url.validity < 1 || url.validity > 525600) {
        newUrls[index].error = 'Validity must be 1-525600 minutes';
        isValid = false;
      }
    });
    setUrls(newUrls);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(urls);
  };

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LinkIcon sx={{ mr: 1 }} /> URL Shortener
        </Typography>
        <form onSubmit={handleSubmit}>
          {urls.map((url, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Original URL" placeholder="https://example.com" value={url.originalUrl} onChange={(e) => updateUrl(index, 'originalUrl', e.target.value)} error={!!url.error} helperText={url.error} required />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField fullWidth label="Validity (minutes)" type="number" value={url.validity} onChange={(e) => updateUrl(index, 'validity', parseInt(e.target.value) || 30)} inputProps={{ min: 1, max: 525600 }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Custom Shortcode (optional)" value={url.customShortcode} onChange={(e) => updateUrl(index, 'customShortcode', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={1}>
                  {urls.length > 1 && <IconButton onClick={() => removeUrlField(index)} color="error"><DeleteIcon /></IconButton>}
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {urls.length < 5 && <Button startIcon={<AddIcon />} onClick={addUrlField} variant="outlined">Add URL</Button>}
            <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : null}>{isLoading ? 'Shortening...' : 'Shorten URLs'}</Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default URLForm;

