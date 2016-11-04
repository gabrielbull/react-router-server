import React, { Component, PropTypes } from 'react';

class ServerStateProvider extends Component {
  static propTypes = {
    state: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.node]),
  };

  static childContextTypes = {
    reactRouterServerServerState: PropTypes.object
  };

  asyncMountIdx = 0;
  asyncMountChildrenIdx = {};

  getChildContext() {
    return {
      reactRouterServerServerState: {
        getState: this.getState,
        getAsyncMountIdx: this.getAsyncMountIdx
      }
    };
  }

  getState = (idx) => {
    if (this.props.state && this.props.state[idx]) {
      const state = this.props.state[idx];
      delete this.props.state[idx];
      return state;
    }
    return {};
  };

  getAsyncMountIdx = (parentIndex) => {
    if (typeof parentIndex !== 'undefined' && parentIndex !== undefined && parentIndex !== null) {
      if (!this.asyncMountChildrenIdx[parentIndex]) this.asyncMountChildrenIdx[parentIndex] = 1;
      else this.asyncMountChildrenIdx[parentIndex] = this.asyncMountChildrenIdx[parentIndex] + 1;
      return parentIndex + '.' + this.asyncMountChildrenIdx[parentIndex];
    }
    this.asyncMountIdx = this.asyncMountIdx + 1;
    return this.asyncMountIdx + '';
  };

  render() {
    return this.props.children;
  }
}

export default ServerStateProvider;
