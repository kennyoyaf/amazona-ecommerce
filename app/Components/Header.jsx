'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, styled, Box } from '@mui/material';
import NextLink from 'next/link';
import Link from 'next/link';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#203040',
  '& a': {
    color: '#ffffff',
    marginLeft: '10px'
  }
});

const BrandTypography = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.5rem'
});

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#203040',
        '& a': {
          color: '#ffffff',
          marginLeft: 2
        }
      }}
    >
      <Toolbar>
        <NextLink href="/" passHref>
          <Link>
            {' '}
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
            >
              amazona
            </Typography>
          </Link>
        </NextLink>

        <Box sx={{ flexGrow: 1 }}></Box>
        <div>
          <NextLink href="/cart" passHref>
            <Link>Cart</Link>
          </NextLink>
          <NextLink href="/login" passHref>
            <Link>Login</Link>
          </NextLink>
        </div>
      </Toolbar>
    </AppBar>
  );
}
