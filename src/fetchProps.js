import React, { Component, PropTypes } from 'react';

export default (mapStateToProps, mapActionsToProps) => WrappedComponent =>{
  return class extends Component {
    static contextTypes = {
      serverRouter: PropTypes.object,
      serverState: PropTypes.object,
      reactRouterServerFetchPropsParentId: PropTypes.string
    };

    static childContextTypes = {
      reactRouterServerFetchPropsParentId: PropTypes.string
    };

    getChildContext() {
      return {
        reactRouterServerFetchPropsParentId: this.idx
      };
    }

    constructor() {
      super();
      this.state = {};
    }

    get asyncRenderer() {
      return typeof this.context.serverRouter === 'object' && this.context.serverRouter.asyncRenderer ?
        this.context.serverRouter.asyncRenderer : null;
    }

    componentWillMount() {
      if (this.asyncRenderer) {
        this.idx = this.asyncRenderer.getAsyncMountIdx(this.context.reactRouterServerFetchPropsParentId);
        if (!this.asyncRenderer.hasAsyncMountResult(this.idx)) {
          this.asyncRenderer.awaitForAsyncMount++;
        } else {
          this.setState({ ...this.asyncRenderer.getAsyncMountResult(this.idx) });
        }
      } else if (this.context.serverState) {
        this.idx = this.context.serverState.getAsyncMountIdx(this.context.reactRouterServerFetchStateParentId);
        const state = this.context.serverState.getState(this.idx);
        if (state) {
          this.setState({ ...state });
        }
      }
    }

    actions = () => ({
      done: this.handleDone
    });

    handleDone = data => {
      if (this.asyncRenderer) {
        if (!this.asyncRenderer.hasAsyncMountResult(this.idx)) {
          this.asyncRenderer.storeAsyncMountResult(this.idx, data);
          this.asyncRenderer.awaitForAsyncMount--;
          this.asyncRenderer.handleAsyncComponentMounted();
        }
      } else {
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
