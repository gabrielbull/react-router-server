import * as React from 'react';
import { expect } from 'chai';
import renderToString from '../../../src/renderer/renderToString';
import App from './includes/App';

describe('renderToString', () => {
  it('should do render to string with module loaded and state fetched', done => {
    this.timeout(15000);
    renderToString(<App/>)
      .then(({ html, state, modules }) => {
        expect(html).to.match(/foobar/);
        expect(state).to.deep.equal({ '1': { message: 'foobar' }});
        expect(modules).to.have.lengthOf(1);

        renderToString(<App/>)
          .then(({ html, state, modules }) => {
            expect(html).to.match(/foobar/);
            expect(state).to.deep.equal({ '1': { message: 'foobar' }});
            expect(modules).to.have.lengthOf(1);
            done();
          })
      })
  });
});
