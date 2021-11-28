import React from 'react';
import type { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { push } = useRouter();

  React.useEffect(() => {
    push('/ether');
  }, []);

  return <div>Loading..</div>;
};

// Redirect '/' to '/ether'
Home.getInitialProps = async ({ res }: NextPageContext) => {
  if (res) {
    res.writeHead(301, { Location: '/ether' });
    res.end();
  }
  return {};
};

export default Home;
