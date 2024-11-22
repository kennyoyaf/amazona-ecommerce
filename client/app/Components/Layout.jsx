'use client';

import React, { useContext, useMemo } from 'react';
import Header from './header';
import Footer from './Footer';
import Head from 'next/head';
import { Store } from '@/utils/Store';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import getTheme from '@/utils/styles';

export default function Layout({ title, desctiption, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        {desctiption && <meta name="description" content={desctiption}></meta>}
      </Head>
      <Header
        dispatch={dispatch}
        darkMode={darkMode}
        cart={cart}
        userInfo={userInfo}
      />
      <Container sx={{ minHeight: '80vh' }}>{children}</Container>
      <Footer />
    </ThemeProvider>
  );
}
