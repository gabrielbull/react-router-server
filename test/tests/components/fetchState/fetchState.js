import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import Foo from './includes/Foo';

describe('fetchState', () => {
  it('should do fetchState for component', done => {
    renderToStaticMarkup(<Foo/>);
    setTimeout(() => {
      done();
    }, 10);
  });
});
