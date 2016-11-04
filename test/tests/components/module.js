import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import Module from '../../../src/components/Module';

describe('module', () => {
  it('should load module using babel plugin', done => {
    renderToStaticMarkup(
      <Module
        module={() => System.import('./includes/Foo')}
        name="foo"
      >
        { Foo => Foo && <Foo /> }
      </Module>
    );
    setTimeout(() => {
      const result = renderToStaticMarkup(
        <Module
          module={() => System.import('./includes/Foo')}
          name="foo"
        >
          { Foo => Foo && <Foo.default/> }
        </Module>
      );
      expect(result).to.match(/foobar/);
      done();
    });
  });
});
