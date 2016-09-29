import React, { Component, PropTypes, isValidElement } from 'react'
import { setAsyncRenderer } from './importModule';

export default (render, options, asyncRenderer) => (matchProps) => {
  class WrapperComponent extends Component {
    isComponentMounted = false;

    constructor() {
      super();
      this.state = { nextProps: {}, WrappedComponent: null };
    }

    componentWillMount() {
      this.isComponentMounted = true;
      this.resolveRenderMethod();
    }

    resolveRenderMethod() {
      let WrappedComponent;
      let idx;
      if (asyncRenderer) {
        idx = asyncRenderer.getAsyncRenderIdx();
      }

      if (asyncRenderer && asyncRenderer.renderPass) {
        WrappedComponent = asyncRenderer.getAsyncRenderResult(idx);
      }

      if (!WrappedComponent) {
        setAsyncRenderer(asyncRenderer);
        WrappedComponent = render(matchProps, { ...this.state.nextProps });
      }

      if (WrappedComponent.then) {
        if (asyncRenderer) {
          asyncRenderer.awaitForAsyncRender++;
        }

        WrappedComponent.then(Component => {
          if (asyncRenderer) {
            asyncRenderer.storeAsyncRenderResult(idx, Component);
            asyncRenderer.awaitForAsyncRender--;
            asyncRenderer.handleModuleLoaded();
          } else {
            if (this.isComponentMounted) this.setState({ WrappedComponent: Component });
          }
        });
      } else {
        this.setState({ WrappedComponent });
      }
    }

    componentWillUnmount() {
      this.isComponentMounted = false;
    }

    render() {
      if (isValidElement(this.state.WrappedComponent)) {
        return this.state.WrappedComponent;
      } else if (typeof this.state.WrappedComponent === 'function') {
        const { WrappedComponent } = this.state;
        return <WrappedComponent/>;
      }
      return null;
    }
  }

  return <WrapperComponent/>;
};
