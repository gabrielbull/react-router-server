import React, { Component } from 'react';

class ServerStateProvider extends Component {
  static propTypes = {
    state: () => null,
    children: () => null,
  };

  static childContextTypes = {
    reactRouterServerServerState: () => null
  };

  fetchStateIndex = 0;
  fetchStateChildrenIndex = {};

  getChildContext() {
    return {
      reactRouterServerServerState: {
        getState: this.getState,
        getFetchStateIndex: this.getFetchStateIndex
      }
    };
  }

  getState = (index) => {
    if (this.props.state && this.props.state[index]) {
      const state = this.props.state[index];
      delete this.props.state[index];
      return state;
    }
    return {};
  };

  getFetchStateIndex = (parentIndex) => {
    if (typeof parentIndex !== 'undefined' && parentIndex !== undefined && parentIndex !== null) {
      if (!this.fetchStateChildrenIndex[parentIndex]) this.fetchStateChildrenIndex[parentIndex] = 1;
      else this.fetchStateChildrenIndex[parentIndex] = this.fetchStateChildrenIndex[parentIndex] + 1;
      return parentIndex + '.' + this.fetchStateChildrenIndex[parentIndex];
    }
    this.fetchStateIndex = this.fetchStateIndex + 1;
    return this.fetchStateIndex + '';
  };

  render() {
    return this.props.children;
  }
}

export default ServerStateProvider;
