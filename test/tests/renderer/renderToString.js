import * as React from 'react';
import { expect } from 'chai';
import renderToString from '../../../src/renderer/renderToString';
import App from './includes/App';

describe('renderToString', () => {
  it('should do something', done => {
    renderToString(<App/>)
      .then(html => {
        console.log(html);
        done();
      })
  });
});
