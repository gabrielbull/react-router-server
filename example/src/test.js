import React, { Component, PropTypes } from 'react';
import { fetchProps } from 'react-router-server';

class Test extends Component {
  render() {
    return (
      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid gray' }}>
        This is another module.
      </div>
    );
  }
}

export default Test;
