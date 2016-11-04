import * as React from 'react';
import { expect } from 'chai';
import renderToString from '../../../src/renderer/renderToString';
import App from './includes/App';

describe('renderToString', () => {
  it('should do render to string with module loaded and state fetched', done => {
    renderToString(<App/>)
      .then(html => {
        expect(html).to.match(/foobar/);
        done();
      })
  });
});
