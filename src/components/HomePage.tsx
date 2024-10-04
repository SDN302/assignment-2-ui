import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
      p={4}
    >
      <Typography variant="h2" gutterBottom color="primary" fontWeight="bold">
        Welcome to the Quizzes App
      </Typography>
      <Typography variant="h5" gutterBottom color="textSecondary">
        Test your knowledge with our quizzes!
      </Typography>
      <Box mt={4} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/quizzes')}
          sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
        >
          View Quizzes List
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/questions')}
          sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
        >
          View Questions List
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;