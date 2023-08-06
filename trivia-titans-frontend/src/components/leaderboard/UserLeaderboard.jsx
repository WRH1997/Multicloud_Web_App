import React, { useState } from 'react';
import invokeLambdaFunction from "../common/InvokeLambda";

const UserLeaderboardPage = () => {
  const [filter, setFilter] = useState('');
  const [userStats, setUserStats] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const fetchLeaderboard = async () => {
    try {
        console.log(filter);
        const response = await invokeLambdaFunction('userLeaderboard', {
            filter: filter,
          });
        console.log(response);
        setUserStats(response.top_users);
      } catch (error) {
        // Handle any error that occurred during the Lambda function invocation
        console.error('Error fetching leaderboard:', error);
      }
  };

  return (
    <div>
      <h1>Trivia Game Leaderboard</h1>
      <div>
        <label>
          Choose Filter:
          <select value={filter} onChange={handleFilterChange}>
            <option value="">Select Filter</option>
            <option value="games_played">Games Played</option>
            <option value="total_points_earned">Total Points Earned</option>
            <option value="win">Wins</option>
          </select>
        </label>
        <button onClick={fetchLeaderboard} disabled={!filter}>
          Show Leaderboard
        </button>
      </div>
      {userStats.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div  style={{ width: '90%' }}>
            <h2>User Leaderboard</h2>
            <table style={{ borderCollapse: 'collapse', width: '90%' }}>
                <thead>
                <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Games Played</th>
                    <th style={tableHeaderStyle}>Total Points Earned</th>
                    <th style={tableHeaderStyle}>Wins</th>
                </tr>
                </thead>
                <tbody>
                {userStats.map((user) => (
                    <tr key={user.name}>
                    <td style={tableCellStyle}>{user.name}</td>
                    <td style={tableCellStyle}>{user.games_played}</td>
                    <td style={tableCellStyle}>{user.total_points_earned}</td>
                    <td style={tableCellStyle}>{user.win}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const tableHeaderStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
  };
  
  const tableCellStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
  };

export default UserLeaderboardPage;
