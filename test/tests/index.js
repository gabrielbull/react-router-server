import { expect } from 'chai';
import {
  extractModules,
  fetchState,
  Module,
  preload,
  renderToString,
  ServerStateProvider
} from '../../src/index';

describe('index', () => {
  it('should be exported', () => {
    expect(extractModules).to.exist;
    expect(fetchState).to.exist;
    expect(Module).to.exist;
    expect(preload).to.exist;
    expect(renderToString).to.exist;
    expect(ServerStateProvider).to.exist;
  });
});
