import React from 'react';
import { Typography, Card, CardContent, Box, Link, IconButton } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { formatDateTime } from '../utils/helpers';

const ShortenedUrlResults = ({ results, onCopy }) => {
  if (!results || results.length === 0) return null;

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Shortened URLs</Typography>
        {results.map((result, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">Original: {result.originalUrl}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Link href={result.shortUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 'bold' }}>{result.shortUrl}</Link>
              <IconButton size="small" onClick={() => onCopy(result.shortUrl)}><ContentCopyIcon fontSize="small" /></IconButton>
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>Expires: {formatDateTime(result.expiryDate)}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default ShortenedUrlResults;
