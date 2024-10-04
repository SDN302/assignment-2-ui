import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#f1f1f1' }}>
      <Typography variant="body1" align="center">
        © 2024 Quiz App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;