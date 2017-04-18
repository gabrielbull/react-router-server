import * as React from 'react';
import { expect } from 'chai';
import renderToStaticMarkup from '../../../src/renderer/renderToStaticMarkup';
import App from './includes/App';
import FailureApp from './includes/FailureApp';

describe('renderToStaticMarkup', () => {
  it('should do render to static markup', function (done) {
    this.timeout(15000);
    renderToStaticMarkup(<App/>)
      .then(({ html, state, modules }) => {
        expect(html).to.equal('<div><div>foobar</div></div>');
        expect(state).to.deep.equal({ '1': { message: 'foobar' }});
        expect(modules).to.have.lengthOf(1);
        done();
      })
  });
  it('should handle errors properly', () => {
    renderToStaticMarkup(<FailureApp/>)
      .then(() => {
        throw new Error('should not be called')
      })
      .catch(e => {
        expect(e.message).to.equal('aw snap!')
      })
  })
});
