import React from 'react';
import App from './app';
import { BrowserRouter } from 'react-router';
import { render } from 'react-dom';
import { preloadModules, ServerStateProvider } from 'react-router-server';

preloadModules(__INITIAL_MODULES__).then(() => {
  render((
    <ServerStateProvider state={__INITIAL_STATE__}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ServerStateProvider>
  ), document.getElementById('main'));
});
