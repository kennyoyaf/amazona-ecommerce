import React from 'react';
import Header from './header';
import Footer from './Footer';
import Head from 'next/head';

export default function Layout({ title, desctiption, children }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        {desctiption && <meta name="desctiption" content={desctiption}></meta>}
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}
