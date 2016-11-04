import React, { Component, PropTypes } from 'react';
import isNode from '../utils/isNode';

export default (mapStateToProps, mapActionsToProps) => WrappedComponent =>{
  return class extends Component {
    static contextTypes = {
      reactRouterServerAsyncRenderer: PropTypes.object,
      reactRouterServerServerState: PropTypes.object,
      reactRouterServerFetchStateParentIndex: PropTypes.string
    };

    static childContextTypes = {
      reactRouterServerFetchStateParentIndex: PropTypes.string
    };

    getChildContext() {
      return {
        reactRouterServerFetchStateParentIndex: this.idx
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
        // todo: client side
        //this.idx = this.context.serverState.getAsyncMountIdx(this.context.reactRouterServerFetchStateParentId);
        //const state = this.context.serverState.getState(this.idx);
        //if (state) {
          //this.setState({ ...state });
        //}
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
