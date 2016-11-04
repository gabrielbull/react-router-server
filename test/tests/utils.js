import { expect } from 'chai';
import isNode from '../../src/utils/isNode';

describe('utils', () => {
  it('isNode', () => {
    expect(isNode()).to.be.true;
  });
});
