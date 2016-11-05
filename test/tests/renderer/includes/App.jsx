import * as React from 'react';
import Module from '../../../../src/components/Module';

const App = (props) => (
  <div>
    <Module name="foo" module={() => System.import('./Foo')}>
      { module => module ? <module.default/> : null}
    </Module>
  </div>
);

export default App;
