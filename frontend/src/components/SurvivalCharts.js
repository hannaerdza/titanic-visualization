import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Box, Typography, Grid, Paper } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SurvivalCharts = ({ statistics, loading }) => {
  if (loading || !statistics) {
    return <Typography>Loading statistics data...</Typography>;
  }

  // Prepare data for the overall survival pie chart
  const survivalData = [
    { name: 'Survived', value: statistics.total.survivors },
    { name: 'Did not survive', value: statistics.total.passengers - statistics.total.survivors }
  ];

  // Prepare data for class-based survival chart
  const classSurvivalData = statistics.by_class.map(cls => ({
    name: `Class ${cls.class}`,
    survived: cls.survived,
    died: cls.total - cls.survived
  }));

  // Prepare data for gender-based survival chart
  const genderSurvivalData = statistics.by_gender.map(gender => ({
    name: gender.gender.charAt(0).toUpperCase() + gender.gender.slice(1),
    survived: gender.survived,
    died: gender.total - gender.survived
  }));

  // Calculate survival rates for classes
  const survivalRateByClass = statistics.by_class.map(cls => ({
    name: `Class ${cls.class}`,
    rate: Math.round(cls.rate * 100)
  }));

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Titanic Survival Statistics</Typography>
      
      <Grid container spacing={3}>
        {/* Overall Survival Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Overall Survival Rate</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={survivalData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {survivalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Survival Rate by Class */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Survival Rate by Class (%)</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={survivalRateByClass}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Survival Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Survival by Class Stacked Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Survival by Class</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={classSurvivalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Passengers', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="survived" stackId="a" fill="#0088FE" name="Survived" />
                <Bar dataKey="died" stackId="a" fill="#FF8042" name="Did not survive" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Survival by Gender Stacked Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Survival by Gender</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={genderSurvivalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Passengers', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="survived" stackId="a" fill="#0088FE" name="Survived" />
                <Bar dataKey="died" stackId="a" fill="#FF8042" name="Did not survive" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SurvivalCharts;