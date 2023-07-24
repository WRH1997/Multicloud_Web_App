import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import AWS from 'aws-sdk';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        AWS.config.update({
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

    fetchData();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <Typography variant="h4">Leaderboard</Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell align="right">Score</TableCell>
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
