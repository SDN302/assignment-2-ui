import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0 }}>
      <Toolbar style={{ justifyContent: 'center' }}>
        <Typography variant="body1" color="inherit">
          © Copy right by bakaqc, 2024 Quizzes App
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;