import * as React from 'react';
import Module from '../../../../src/components/Module';

export default props => (
  <Module
    module={() => System.import('./Foo')}
    name="foo"
  >
    { Foo => Foo && <Foo.default/> }
  </Module>
);
