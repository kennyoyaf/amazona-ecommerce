'use client';

import './globals.css';
import { Roboto } from 'next/font/google';
import { StoreProvider } from '@/utils/Store';
import { SnackbarProvider } from 'notistack';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <PayPalScriptProvider
              deferLoading={false}
              options={{ 'client-id': 'sb', currency: 'USD' }}
            >
              {children}
            </PayPalScriptProvider>
          </SnackbarProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
