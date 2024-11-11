'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import './globals.css';

const theme = createTheme({
  palette: {
    primary: { main: '#ffffff' }
  }
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </html>
  );
}
