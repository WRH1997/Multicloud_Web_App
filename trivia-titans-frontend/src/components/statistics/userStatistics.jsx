import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from "react-router";
import {AuthContext} from "../common/AuthContext";
import invokeLambdaFunction from "../common/InvokeLambda";


const GetUserStatistics = () => {
    const [statistics, setStatistics] = useState(null);
    const currentUser = useContext(AuthContext);
    console.log(currentUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            // if user not logged in, navigate to login
            navigate("/login");
        }
    }, [currentUser, navigate]);
    useEffect(() => {
      const fetchUserStatistics = async () => {
        try {
          const response = await invokeLambdaFunction('UserStatistics', {
            uid: currentUser.uid,
          });
          setStatistics(response);
        } catch (error) {
          // Handle any error that occurred during the Lambda function invocation
          console.error('Error fetching user statistics:', error);
        }
      };
  
      fetchUserStatistics();
    }, []);
  
    return (
      <div>
        {statistics ? (
          <div>
            <h2>User Statistics</h2>
            <p>Games Played: {statistics.gamesPlayed}</p>
            <p>Wins: {statistics.win}</p>
            <p>Loss: {statistics.loss}</p>
            <p>Win/Loss Ratio: {statistics.winLossRatio}</p>
            <p>Total Points Earned: {statistics.totalPointsEarned}</p>
          </div>
        ) : (
          <p>Loading user statistics...</p>
        )}
      </div>
    );
  };
  
  export default GetUserStatistics;