import React, { Component } from 'react';
import isNode from '../utils/isNode';

export default (mapStateToProps, mapActionsToProps) => WrappedComponent => {
  return class extends Component {
    static contextTypes = {
      reactRouterServerAsyncRenderer: () => null,
      reactRouterServerServerState: () => null,
      reactRouterServerFetchStateParentIndex: () => null
    };

    static childContextTypes = {
      reactRouterServerFetchStateParentIndex: () => null
    };

    getChildContext() {
      return {
        reactRouterServerFetchStateParentIndex: this.index
      };
    }

    index;

    constructor() {
      super();
      this.state = {};
    }

    componentWillMount() {
      this._componentIsMounted = true;
      const {
        reactRouterServerAsyncRenderer: asyncRenderer,
        reactRouterServerServerState: serverState,
        reactRouterServerFetchStateParentIndex: parentIndex
      } = this.context;

      if (asyncRenderer) {
        this.index = asyncRenderer.getFetchStateIndex(parentIndex);
        if (!asyncRenderer.hasFetchStateResult(this.index)) {
          asyncRenderer.startFetchState();
        } else {
          this.setState({ ...asyncRenderer.getFetchStateResult(this.index) });
        }
      } else if (serverState) {
        this.index = serverState.getFetchStateIndex(parentIndex);
        const state = serverState.getState(this.index);
        if (state) {
          if (this._componentIsMounted) {
            this.setState({ ...state });
          }
        }
      }
    }

    componentWillUnmount() {
      this._componentIsMounted = false;
    }

    actions = () => ({
      done: this.handleDone
    });

    handleDone = data => {
      if (isNode()) {
        const { reactRouterServerAsyncRenderer: asyncRenderer } = this.context;
        if (asyncRenderer) {
          if (!asyncRenderer.hasFetchStateResult(this.index)) {
            asyncRenderer.finishFetchState(this.index, data);
          }
        }
      } else if (this._componentIsMounted) {
        this.setState({ ...data });
      }
    };

    render() {
      let nextProps = { ...this.props };
      if (mapStateToProps) nextProps = { ...nextProps, ...mapStateToProps(this.state) };
      if (mapActionsToProps) nextProps = { ...nextProps, ...mapActionsToProps(this.actions()) };
      return <WrappedComponent {...nextProps}/>;
    }
  };
};
