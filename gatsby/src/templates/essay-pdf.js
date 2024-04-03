import React, {useEffect} from 'react';
import {HeadMeta} from '../components/meta-data-head';
import Layout from '../components/layout';

import '../styles/essay.scss';

export default function EssayPdf({
  pageContext: { toPath },
}) {
  useEffect(() => {
    window.location.replace(toPath);
  }, []);

  return (
    <Layout location={'single-post'}>
      <div className="pdf-loading">
        Loading...
      </div>
    </Layout>
  );
}

export const Head = () =>
  <>
    <HeadMeta />
    <meta name="robots" content="noindex" />
  </>;
