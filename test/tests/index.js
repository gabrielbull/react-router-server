import { expect } from 'chai';
import {
  fetchState,
  importModule,
  Match,
  preloadModules,
  renderToString,
  ServerStateProvider,
  importWebpackBundle
} from '../../src/index';

describe('index', () => {
  it('should be exported', () => {
    expect(fetchState).to.exist;
    expect(importModule).to.exist;
    expect(Match).to.exist;
    expect(preloadModules).to.exist;
    expect(renderToString).to.exist;
    expect(ServerStateProvider).to.exist;
    expect(importWebpackBundle).to.exist;
  });
});
