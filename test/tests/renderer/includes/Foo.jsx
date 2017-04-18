import React, { Component } from 'react';
import fetchState from '../../../../src/components/fetchState';

@fetchState(
  ({ message }) => ({ message }),
  ({ done }) => ({ done }),
)
class Foo extends Component {
  componentWillMount() {
    setTimeout(() => {
      this.props.done({ message: 'foobar' });
    }, 5);
  }

  render() {
    return (
      <div>{this.props.message}</div>
    );
  }
}

export default Foo;
