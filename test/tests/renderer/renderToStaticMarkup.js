import * as React from 'react';
import { expect } from 'chai';
import renderToStaticMarkup from '../../../src/renderer/renderToStaticMarkup';
import App from './includes/App';

describe('renderToStaticMarkup', () => {
  it('should do render to static markup', done => {
    renderToStaticMarkup(<App/>)
      .then(({ html, state, modules }) => {
        expect(html).to.equal('<div><div>foobar</div></div>');
        expect(state).to.deep.equal({ '1': { message: 'foobar' }});
        expect(modules).to.have.lengthOf(1);
        done();
      })
  });
});
