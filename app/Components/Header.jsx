import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#0d47a1' }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            amazona
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
