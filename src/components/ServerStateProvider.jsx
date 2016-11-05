import React, { Component, PropTypes } from 'react';

class ServerStateProvider extends Component {
  static propTypes = {
    state: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.node]),
  };

  static childContextTypes = {
    reactRouterServerServerState: PropTypes.object
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

  getState = (idx) => {
    console.log(this.props.state);
    if (this.props.state && this.props.state[idx]) {
      const state = this.props.state[idx];
      delete this.props.state[idx];
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
