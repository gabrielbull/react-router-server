import React, { Component, PropTypes } from 'react';

class ServerStateProvider extends Component {
  static propTypes = {
    state: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.node]),
  };

  static defaultProps = {
  };

  static childContextTypes = {
    serverState: PropTypes.object
  };

  idx = 0;

  getChildContext() {
    return {
      serverState: {
        getState: this.getState
      }
    };
  }

  getState = () => {
    const idx = this.getIdx();
    if (this.props.state && this.props.state[idx]) {
      const state = this.props.state[idx];
      delete this.props.state[idx];
      return state;
    }
    return {};
  };

  getIdx = () => {
    return this.idx++;
  };

  render() {
    return this.props.children;
  }
}

export default ServerStateProvider;
