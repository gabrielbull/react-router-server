import * as React from 'react';

class AsyncRenderer extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired
  };

  static childContextTypes = {
    reactRouterServerAsyncRenderer: React.PropTypes.object
  };

  getChildContext = () => ({
    reactRouterServerAsyncRenderer: this
  });

  startLoadingModule = () => {
    if (this.props.context.modulesLoading === undefined) this.props.context.modulesLoading = 1;
    else this.props.context.modulesLoading++;
  };

  finishLoadingModule = (info, module) => {
    this.props.context.modulesLoading--;
    if (this.props.context.modules === undefined) this.props.context.modules = [];
    this.props.context.modules.push({ info, module });

    if (this.props.context.modulesLoading <= 0) {
      this.props.context.callback();
    }
  };

  render() {
    return this.props.children;
  }
}

export default AsyncRenderer;
