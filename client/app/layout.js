'use client';

import './globals.css';
import { Roboto } from 'next/font/google';
import { StoreProvider } from '@/utils/Store';
import { SnackbarProvider } from 'notistack';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <StoreProvider>
          <body className={roboto.className}>{children}</body>
        </StoreProvider>
      </SnackbarProvider>
    </html>
  );
}
