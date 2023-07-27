import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import AWS from 'aws-sdk';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filter, setFilter] = useState('week');

  const fetchData = async () => {
    try {
      AWS.config.update({
      });

      const currentTime = new Date().toISOString();
      const days = getDaysForFilter(filter);

      const data = {
        tableName: "TriviaLeaderboard",
        time: currentTime,
        days: days
      };
  
      const params = {
        FunctionName: 'arn:aws:lambda:us-east-1:940444391781:function:teamLeaderboard',
        Payload: JSON.stringify(data)
      };
      const lambda = new AWS.Lambda();
  
      const response = await lambda.invoke(params).promise();
      const array = JSON.parse(response.Payload);
      setLeaderboardData(array);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleSortToggle = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    setLeaderboardData(prevLeaderboardData => [...prevLeaderboardData].reverse());
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const getDaysForFilter = (selectedFilter) => {
    switch (selectedFilter) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'year':
        return 365;
      default:
        return 7;
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <Typography variant="h4">Leaderboard</Typography>
      <FormControl style={{ marginTop: '20px' }}>
        <Select value={filter} onChange={handleFilterChange}>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell align="right">
                Score
                <IconButton onClick={handleSortToggle}>
                  {sortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((team) => (
              <TableRow key={team.teamName}>
                <TableCell>{team.teamName}</TableCell>
                <TableCell align="right">{team.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Leaderboard;