import * as React from 'react';

class AsyncRenderer extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired
  };

  static childContextTypes = {
    reactRouterServerAsyncRenderer: React.PropTypes.object
  };

  fetchStateResults = {};
  fetchStateHasFinished = {};
  finishedLoadingModules = true;

  constructor(props) {
    super();
    if (props.context.fetchStateResults) {
      this.fetchStateResults = { ...props.context.fetchStateResults };
      for (let prop in this.fetchStateResults) {
        if (this.fetchStateResults.hasOwnProperty(prop)) {
          this.fetchStateHasFinished[prop] = true;
        }
      }
    }
  }

  getChildContext = () => ({
    reactRouterServerAsyncRenderer: this
  });

  fetchStateIndex = 0;
  fetchStateIndexes = {};
  getFetchStateIndex = parentIndex => {
    if (typeof parentIndex !== 'undefined' && parentIndex !== undefined && parentIndex !== null) {
      if (!this.fetchStateIndexes[parentIndex]) this.fetchStateIndexes[parentIndex] = 1;
      else this.fetchStateIndexes[parentIndex]++;
      return parentIndex + '.' + this.fetchStateIndexes[parentIndex];
    }
    this.fetchStateIndex++;
    return this.fetchStateIndex + '';
  };

  hasFetchStateResult = index => this.fetchStateHasFinished[index] === true;
  getFetchStateResult = index => this.fetchStateResults[index];

  startFetchState = () => {
    if (this.props.context.fetchingStates === undefined) this.props.context.fetchingStates = 1;
    else this.props.context.fetchingStates++;
  };

  finishFetchState = (index, result) => {
    this.fetchStateHasFinished[index] = true;
    this.fetchStateResults[index] = result;

    this.props.context.fetchingStates--;
    if (this.props.context.fetchingStates <= 0 && this.props.context.modulesLoading <= 0 && this.props.context.statesRenderPass) {
      this.props.context.fetchStateResults = this.fetchStateResults;
      this.props.context.callback();
    }
  };

  startLoadingModule = () => {
    this.props.context.finishedLoadingModules = false;
    if (this.props.context.modulesLoading === undefined) this.props.context.modulesLoading = 1;
    else this.props.context.modulesLoading++;
  };

  finishLoadingModule = (info, module) => {
    this.props.context.modulesLoading--;
    if (this.props.context.modules === undefined) this.props.context.modules = [];
    this.props.context.modules.push({ info, module });

    if (this.props.context.modulesLoading <= 0 && !this.props.context.finishedLoadingModules) {
      this.props.context.finishedLoadingModules = true;
      this.props.context.callback();
    }
  };

  render() {
    return this.props.children;
  }
}

export default AsyncRenderer;
