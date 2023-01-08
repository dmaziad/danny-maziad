import Head from 'next/head'
import React from 'react';
import NavBar from '../NavBar';

const CommonLayout = ({title, pageDesc, children}) => {
  const pageTitle = `Danny Maziad | ${title}`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`Danny Maziad Software Engineer ${pageDesc}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {children}
    </>
  );
}

export default CommonLayout;