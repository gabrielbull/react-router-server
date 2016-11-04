import * as React from 'react';
import { exists, add, fetch } from '../module/cache';
import { default as load } from '../module/load';
import isNode from '../utils/isNode';

class Module extends React.Component {
  static propTypes = {
    module: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    children: React.PropTypes.func
  };

  state = {
    module: null
  };

  componentWillMount() {
    this._componentIsMounted = true;
    if (exists(module, this.props.module)) {
      const { info, loadedModule } = fetch(module, this.props.module);
      this.setState({ module: loadedModule });
    } else {
      load(module, this.props.module)(this.props.module())
        .then(({ info, module: loadedModule }) => {
          add(module, this.props.module, { info, loadedModule });
          if (!isNode()) {
            if (this._componentIsMounted) {
              this.setState({ module: loadedModule });
            }
          } else {
            //console.log(info);
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
    return module ? children(module) : null;
  }
}

export default Module;
