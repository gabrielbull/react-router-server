import * as React from 'react';
import fetchState from '../../../../../src/components/fetchState';

@fetchState(
  ({ message }) => ({ message }),
  ({ done }) => ({ done })
)
class Foo extends React.Component {
  componentWillMount() {
    setTimeout(() => {
      // do something async
      this.props.done({ message: 'foobar' });
    }, 5);
  }

  render() {
    const { message } = this.props;
    return message ? (
      <div>{message}</div>
    ) : null;
  }
}

export default Foo;
