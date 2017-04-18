import React, { Component } from 'react';
import { exists, add, fetch } from '../module/cache';
import { exists as preloadExists, fetch as preloadFetch } from '../module/preload';
import { default as load } from '../module/load';
import isNode from '../utils/isNode';

class Module extends Component {
  static propTypes = {
    module: () => null,
    children: () => null
  };

  static contextTypes = {
    reactRouterServerAsyncRenderer: () => null
  };

  state = {
    module: null
  };

  componentWillMount() {
    const { reactRouterServerAsyncRenderer } = this.context;
    this._componentIsMounted = true;

    if (!isNode() && preloadExists(module, this.props.module)) {
      if (this._componentIsMounted) {
        this.setState({ module: preloadFetch(module, this.props.module) });
      }
    } else if (exists(module, this.props.module)) {
      const { info, loadedModule } = fetch(module, this.props.module);
      if (reactRouterServerAsyncRenderer) {
        reactRouterServerAsyncRenderer.finishLoadingModule(info, loadedModule);
      }
      this.setState({ module: loadedModule });
    } else {
      if (reactRouterServerAsyncRenderer) reactRouterServerAsyncRenderer.startLoadingModule();
      load(module, this.props.module)(this.props.module())
        .then(({ info, module: loadedModule }) => {
          add(module, this.props.module, { info, loadedModule });
          if (!isNode()) {
            if (this._componentIsMounted) {
              this.setState({ module: loadedModule });
            }
          } else if (reactRouterServerAsyncRenderer) {
            reactRouterServerAsyncRenderer.finishLoadingModule(info, loadedModule);
          }
        });
    }
  }

  componentWillUnmount() {
    this._componentIsMounted = false;
  }

  render() {
    const { children } = this.props;
    const { module } = this.state;
    return children(module);
  }
}

export default Module;
