import * as React from 'react';
import { expect } from 'chai';
import webpack from 'webpack';
import webpackConfig from './includes/webpack.config';
import renderToString from '../../../src/renderer/renderToString';
import extractModules from '../../../src/stats/extractModules';

describe('stats', () => {
  it('should extract modules from webpack stats', done => {
    this.timeout(15000);
    webpack(webpackConfig, () => {
      Promise.all([System.import('./includes/bundle'), System.import('./includes/stats.json')])
        .then(([{default: App}, stats]) => {
          renderToString(<App/>)
            .then(({ modules }) => {
              const extractedModules = extractModules(modules, stats);
              expect(extractedModules[0]).to.have.property('id', 0);
              expect(extractedModules[0]).to.have.property('files');
              done();
            })
        });
    });
  });
});
