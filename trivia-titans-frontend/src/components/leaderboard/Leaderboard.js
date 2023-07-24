import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import AWS from 'aws-sdk';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchData = async () => {
    try {
      AWS.config.update({
        accessKeyId: 'AKIA5V5W2TFS47B4Y3UC',
        secretAccessKey: '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',
        region: 'us-east-1'
      });
      const data = {
          tableName: "TriviaLeaderboard"
      };
  
      const params = {
        FunctionName: 'arn:aws:lambda:us-east-1:940444391781:function:teamLeaderboard',
        Payload: JSON.stringify(data)
      };
      const lambda = new AWS.Lambda();
  
      const response = await lambda.invoke(params).promise();
      const array = JSON.parse(response.Payload); 
      console.log(array);
      setLeaderboardData(array);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSortToggle = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    setLeaderboardData(prevLeaderboardData => [...prevLeaderboardData].reverse());
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <Typography variant="h4">Leaderboard</Typography>
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