import { useEffect } from "react";
import { useNavigate } from "react-router";
import React from 'react';
import { Grid, Typography, Button } from '@mui/material';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Grid container sx={{
      height: '100vh',
    }}>
      <Grid item xs={12} sm={6} md={6} sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url("https://images2.minutemediacdn.com/image/upload/c_crop,w_2000,h_1125,x_0,y_126/c_fill,w_1440,ar_16:9,f_auto,q_auto,g_auto/images%2FvoltaxMediaLibrary%2Fmmsport%2Fmentalfloss%2F01g895z7vtqjxwvvzj5v.jpg") no-repeat center center/cover`,
      }}></Grid>
      <Grid item xs={12} sm={6} md={6} sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          height="100%"
        >
          <Typography variant="h2" sx={{
            marginBottom: 5,
          }}>
            Quiz Hungry?
          </Typography>
          <Typography variant="h2" sx={{
            fontWeight: 'bold',
            marginBottom: 5,
          }}>
            Trivia Titans!
          </Typography>
          <Typography variant="h5" sx={{
            marginBottom: 5,
          }}>
            Form teams with your friends and compete against other teams in real-time - FINAL E2E Test of CI/CD !
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/Login")}
          >
            Join Us
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}