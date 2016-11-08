import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import Module from '../../../../src/components/Module';
import webpack from 'webpack';
import webpackConfig from './includes/webpack.config';
import { exec } from 'child_process';

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

  it('should load module using webpack bundle', function(done) {
    this.timeout(15000);
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

  it('should load module using webpack bundle with pathinfo true', function(done) {
    this.timeout(15000);
    const config = { ...webpackConfig };
    config.output = { ...config.output, pathinfo: true };
    webpack(config, () => {
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

  it('should load module using webpack bundle with production settings', function(done) {
    this.timeout(15000);
    exec('./node_modules/.bin/webpack --config test/tests/components/module/includes/webpack.config.js -p', () => {
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
