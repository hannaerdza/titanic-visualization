import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Box, Button, Typography
} from '@mui/material';

const PassengerTable = ({ passengers, loading, onFilterChange }) => {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Filters state
  const [filters, setFilters] = useState({
    survived: '',
    pclass: '',
    sex: '',
    minAge: '',
    maxAge: '',
    embarked: ''
  });

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter input changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    
    // Remove empty fields before sending to API
    const apiFilters = {};
    Object.entries(updatedFilters).forEach(([key, val]) => {
      if (val !== '') {
        apiFilters[key] = val;
      }
    });
    
    onFilterChange(apiFilters);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      survived: '',
      pclass: '',
      sex: '',
      minAge: '',
      maxAge: '',
      embarked: ''
    });
    onFilterChange({});
  };

  if (loading) {
    return <Typography>Loading passenger data...</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Survived</InputLabel>
            <Select
              value={filters.survived}
              label="Survived"
              onChange={(e) => handleFilterChange('survived', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={filters.pclass}
              label="Class"
              onChange={(e) => handleFilterChange('pclass', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={1}>1st Class</MenuItem>
              <MenuItem value={2}>2nd Class</MenuItem>
              <MenuItem value={3}>3rd Class</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.sex}
              label="Gender"
              onChange={(e) => handleFilterChange('sex', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Embarked</InputLabel>
            <Select
              value={filters.embarked}
              label="Embarked"
              onChange={(e) => handleFilterChange('embarked', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="C">Cherbourg</MenuItem>
              <MenuItem value="Q">Queenstown</MenuItem>
              <MenuItem value="S">Southampton</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Min Age"
            type="number"
            value={filters.minAge}
            onChange={(e) => handleFilterChange('minAge', e.target.value)}
            sx={{ width: 100 }}
          />
          
          <TextField
            label="Max Age"
            type="number"
            value={filters.maxAge}
            onChange={(e) => handleFilterChange('maxAge', e.target.value)}
            sx={{ width: 100 }}
          />
          
          <Button 
            variant="outlined" 
            onClick={handleResetFilters}
            sx={{ alignSelf: 'center' }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Survived</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Siblings/Spouses</TableCell>
              <TableCell>Parents/Children</TableCell>
              <TableCell>Ticket</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Cabin</TableCell>
              <TableCell>Embarked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passengers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((passenger) => (
                <TableRow key={passenger.PassengerId}>
                  <TableCell>{passenger.PassengerId}</TableCell>
                  <TableCell>{passenger.Name}</TableCell>
                  <TableCell>{passenger.Survived ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{passenger.Pclass}</TableCell>
                  <TableCell>{passenger.Sex}</TableCell>
                  <TableCell>{passenger.Age !== null ? passenger.Age : 'N/A'}</TableCell>
                  <TableCell>{passenger.SibSp}</TableCell>
                  <TableCell>{passenger.Parch}</TableCell>
                  <TableCell>{passenger.Ticket}</TableCell>
                  <TableCell>{passenger.Fare}</TableCell>
                  <TableCell>{passenger.Cabin || 'N/A'}</TableCell>
                  <TableCell>{passenger.Embarked || 'N/A'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={passengers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default PassengerTable;