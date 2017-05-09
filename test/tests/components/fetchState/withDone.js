import * as React from 'react';
import { expect } from 'chai';
import { renderToStaticMarkup } from 'react-dom/server'
import { withDone } from '../../../../src';

describe('withDone', () => {
  it('should pass done property to component', function(done) {
    const Component = props => {
      expect(props.done).to.be.a('Function');
      done();
      return null;
    }
    const ComponentWithDone = withDone(Component);
    renderToStaticMarkup(<ComponentWithDone />);
  });
});
