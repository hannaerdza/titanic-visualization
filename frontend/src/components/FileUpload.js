import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { uploadCsv } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  // State for file, loading status, and messages
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

   // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await uploadCsv(file);
      setSuccess('File uploaded successfully');
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Import CSV Data</Typography>
      
      <input
        type="file"
        accept=".csv"
        id="csv-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="csv-upload">
        <Button variant="contained" component="span">
          Select CSV File
        </Button>
      </label>
      
      {file && (
        <Typography sx={{ mt: 1 }}>
          Selected file: {file.name}
        </Typography>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{ mt: 2, ml: file ? 2 : 0 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;