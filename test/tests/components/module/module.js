import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import Module from '../../../../src/components/Module';
import webpack from 'webpack';
import webpackConfig from './includes/webpack.config';

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

  it('should load module using webpack bundle', done => {
    webpack(webpackConfig, () => {
      System.import('./includes/bundle').then(({ default: App }) => {
        renderToStaticMarkup(<App/>);
        setTimeout(() => {
          const result = renderToStaticMarkup(<App/>);
          expect(result).to.match(/foobar/);
          done();
        });
      });
    });
  });
});
