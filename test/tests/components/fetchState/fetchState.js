import * as React from 'react';
import { renderToStaticMarkup } from '../../../../src/index';
import { expect } from 'chai';
import Foo from './includes/Foo';

describe('fetchState', () => {
  it('should do fetchState for component', done => {
    renderToStaticMarkup(<Foo/>)
      .then((result) => {
        expect(result.html).to.equal('<div>foobar</div>');
        done();
      });
  });
});
