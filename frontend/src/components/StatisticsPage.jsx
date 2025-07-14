import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, Link, IconButton, Collapse, Box, Chip
} from '@mui/material';
import { ExpandMore, ExpandLess, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { formatDateTime } from '../utils/helpers';
import { getGeolocation } from '../utils/geolocation';
import { getUserAgent } from '../utils/helpers';
import { FrontendLogger } from '../../../logging-middleware';

const StatisticsPage = ({ shortenedUrls, onUrlClick }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (shortcode) => {
    const newSet = new Set(expandedRows);
    newSet.has(shortcode) ? newSet.delete(shortcode) : newSet.add(shortcode);
    setExpandedRows(newSet);
  };

  const handleClick = async (shortcode, originalUrl) => {
    try {
      const location = await getGeolocation();
      const userAgent = getUserAgent();
      onUrlClick(shortcode, {
        timestamp: new Date().toISOString(),
        source: userAgent,
        location
      });
      window.open(originalUrl, '_blank');
    } catch (err) {
      FrontendLogger.page.error(`Error handling click: ${err.message}`);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ mr: 1 }} /> URL Statistics
        </Typography>
        {shortenedUrls.length === 0 ? (
          <Typography>No URLs shortened yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortenedUrls.map(url => (
                  <React.Fragment key={url.shortcode}>
                    <TableRow>
                      <TableCell>
                        <Link href="#" onClick={e => { e.preventDefault(); handleClick(url.shortcode, url.originalUrl); }}>{url.shortUrl}</Link>
                      </TableCell>
                      <TableCell><Typography noWrap sx={{ maxWidth: 200 }}>{url.originalUrl}</Typography></TableCell>
                      <TableCell>{formatDateTime(url.createdAt)}</TableCell>
                      <TableCell>{formatDateTime(url.expiryDate)}</TableCell>
                      <TableCell>
                        <Chip label={url.clicks.length} color={url.clicks.length > 0 ? 'primary' : 'default'} size="small" />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => toggleRow(url.shortcode)} disabled={url.clicks.length === 0}>
                          {expandedRows.has(url.shortcode) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 0 }}>
                        <Collapse in={expandedRows.has(url.shortcode)} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2 }}>
                            <Typography variant="h6" gutterBottom>Click Details</Typography>
                            {url.clicks.length === 0 ? (
                              <Typography>No clicks yet.</Typography>
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Source</TableCell>
                                    <TableCell>Location</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {url.clicks.map((click, i) => (
                                    <TableRow key={i}>
                                      <TableCell>{formatDateTime(click.timestamp)}</TableCell>
                                      <TableCell><Typography noWrap sx={{ maxWidth: 200 }}>{click.source}</Typography></TableCell>
                                      <TableCell>{click.location}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsPage;
