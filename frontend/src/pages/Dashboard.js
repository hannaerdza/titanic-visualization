import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tab, Tabs, Paper } from '@mui/material';
import PassengerTable from '../components/PassengerTable';
import SurvivalCharts from '../components/SurvivalCharts';
import FileUpload from '../components/FileUpload';
import { getPassengers, getStatistics } from '../services/api';

// TabPanel component to render content of each tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  // State variables
  const [tabValue, setTabValue] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch passenger data (optionally with filters)
  const fetchPassengers = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getPassengers(filters);
      setPassengers(data);
      setError(null);
    } catch (err) {
      setError('Error fetching passenger data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch survival statistics
  const fetchStatistics = async () => {
    setStatsLoading(true);
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchPassengers();
    fetchStatistics();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (filters) => {
    fetchPassengers(filters);
  };

  const handleUploadSuccess = () => {
    // Refresh data after successful upload
    fetchPassengers();
    fetchStatistics();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Titanic Data Visualization
        </Typography>

        <FileUpload onUploadSuccess={handleUploadSuccess} />

        <Paper sx={{ width: '100%', mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Passenger Data" id="tab-0" />
            <Tab label="Survival Analysis" id="tab-1" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <PassengerTable 
                passengers={passengers} 
                loading={loading}
                onFilterChange={handleFilterChange}
              />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SurvivalCharts statistics={statistics} loading={statsLoading} />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;