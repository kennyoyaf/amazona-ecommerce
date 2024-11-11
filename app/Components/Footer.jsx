import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" py={3} sx={{ backgroundColor: 'transparent' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
          All rights reserved. Next Amazona
        </Typography>
      </Container>
    </Box>
  );
}
