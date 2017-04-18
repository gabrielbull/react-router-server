import * as React from 'react';
import { expect } from 'chai';
import renderToString from '../../../src/renderer/renderToString';
import App from './includes/App';
import FailureApp from './includes/FailureApp';

describe('renderToString', () => {
  it('should do render to string with module loaded and state fetched', function (done) {
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
  it('should handle errors properly', () => {
    renderToString(<FailureApp/>)
      .then(() => {
        throw new Error('should not be called')
      })
      .catch(e => {
        expect(e.message).to.equal('aw snap!')
      })
  })
});
