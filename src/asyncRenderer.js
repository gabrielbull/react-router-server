import { renderToString } from 'react-dom/server';
import extractModules from './extractModules';

class AsyncRenderer {
  modules = {};

  asyncRenderIdx = 0;
  asyncMountIdx = 0;
  asyncMountChildrenIdx = {};

  awaitForAsyncMount = 0;
  awaitForAsyncRender = 0;

  asyncRenderResults = {};
  asyncMountHasResults = [];
  asyncMountResults = {};

  renderPass = false

  constructor(element, context) {
    this.element = element;
    this.context = context;
    this.context.getInitialState = this.getInitialState;
    this.context.getModules = this.getModules;
  }

  render(resolve, reject) {
    this.resolve = resolve;
    this.asyncMountIdx = 0;
    this.asyncMountChildrenIdx = {};
    const markup = renderToString(this.element);
    if (!this.awaitForAsyncMount && !this.awaitForAsyncRender) {
      this.resolve(markup);
    } else if (!this.awaitForAsyncRender) {
      this.renderPass = true;
    }
  }

  handleModuleLoaded = () => {
    if (this.awaitForAsyncRender <= 0 && !this.renderPass) {
      this.renderPass = true;
      this.asyncMountIdx = 0;
      this.asyncMountChildrenIdx = {};
      this.asyncRenderIdx = 0;
      renderToString(this.element);
      this.handleAsyncComponentMounted();
    }
  };

  handleAsyncComponentMounted = () => {
    if (this.awaitForAsyncMount <= 0 && this.awaitForAsyncRender <= 0 && this.renderPass) {
      this.asyncMountIdx = 0;
      this.asyncMountChildrenIdx = {};
      this.asyncRenderIdx = 0;
      const markup = renderToString(this.element);
      if (this.awaitForAsyncMount <= 0) {
        this.resolve(markup);
      }
    }
  };

  getAsyncRenderIdx = () => {
    return this.asyncRenderIdx++;
  };

  storeAsyncRenderResult = (idx, Component) => {
    this.asyncRenderResults[idx] = Component;
  };

  getAsyncRenderResult = idx => {
    return this.asyncRenderResults[idx] !== undefined ? this.asyncRenderResults[idx] : null;
  };

  getAsyncMountIdx = (parentIndex) => {
    if (typeof parentIndex !== 'undefined' && parentIndex !== undefined && parentIndex !== null) {
      if (!this.asyncMountChildrenIdx[parentIndex]) this.asyncMountChildrenIdx[parentIndex] = 1;
      else this.asyncMountChildrenIdx[parentIndex] = this.asyncMountChildrenIdx[parentIndex] + 1;
      return parentIndex + '.' + this.asyncMountChildrenIdx[parentIndex];
    }
    this.asyncMountIdx = this.asyncMountIdx + 1;
    return this.asyncMountIdx + '';
  };

  storeAsyncMountResult = (idx, data) => {
    this.asyncMountResults[idx] = data;
    this.asyncMountHasResults.push(idx);
  };

  getAsyncMountResult = idx => {
    return this.asyncMountResults[idx];
  };

  hasAsyncMountResult = idx => {
    return this.asyncMountHasResults.indexOf(idx) !== -1;
  };

  addModule(name, path) {
    this.modules[name] = path;
  }

  getModules = (stats) => {
    return extractModules(stats, this.modules);
  };

  getInitialState = () => {
    return { ...this.asyncMountResults };
  };
}

export default AsyncRenderer;
