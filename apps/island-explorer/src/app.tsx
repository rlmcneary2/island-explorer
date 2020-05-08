import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { css, Global } from '@emotion/core';
import Main from './components/main';
import { ContentStateProvider } from './state/content/content-context';

const globalStyles = css`
  body {
    font-size: 10px;
    margin: 0;
    padding: 0;
  }

  button {
    border: 0;
    padding: 0;
  }

  p {
    margin: 0;
  }
`;

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter>
      <Global styles={globalStyles} />
      <ContentStateProvider>
        <Main />
      </ContentStateProvider>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById('root')
);
