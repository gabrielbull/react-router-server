import { expect } from 'chai';
import {
  fetchProps,
  importModule,
  Match,
  preloadModules,
  renderToString,
  ServerStateProvider
} from '../../src/index';

describe('index', () => {
  it('should be exported', () => {
    expect(fetchProps).to.exist;
    expect(importModule).to.exist;
    expect(Match).to.exist;
    expect(preloadModules).to.exist;
    expect(renderToString).to.exist;
    expect(ServerStateProvider).to.exist;
  });
});
