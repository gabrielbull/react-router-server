import * as React from 'react';
import Module from '../../../../src/components/Module';

const FailureApp = (props) => (
  <div>
    <Module name="foo" module={() => System.import('./FailureFoo')}>
      { module => module ? <module.default/> : null}
    </Module>
  </div>
);

export default FailureApp;
