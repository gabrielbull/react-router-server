import { renderToString } from 'react-dom/server';
import extractModules from './extractModules';

class AsyncRenderer {
  modules = [];

  constructor(element, context) {
    this.element = element;
    this.context = context;
    this.renderPass = false;
    this.asyncRenderIdx = 0;
    this.asyncMountIdx = 0;
    this.awaitForAsyncMount = 0;
    this.awaitForAsyncRender = 0;
    this.asyncRenderResults = {};
    this.asyncMountResults = {};
    this.context.getInitialState = this.getInitialState;
    this.context.getModules = this.getModules;
  }

  render(resolve, reject) {
    this.resolve = resolve;
    this.asyncMountIdx = 0;
    const markup = renderToString(this.element);
    if (!this.awaitForAsyncMount && !this.awaitForAsyncRender) {
      this.resolve(markup);
    }
  }

  handleModuleLoaded = () => {
    if (!this.awaitForAsyncRender && !this.renderPass) {
      this.renderPass = true;
      this.asyncMountIdx = 0;
      this.asyncRenderIdx = 0;
      renderToString(this.element);
      this.handleAsyncComponentMounted();
    }
  };

  handleAsyncComponentMounted = () => {
    if (!this.awaitForAsyncMount && !this.awaitForAsyncRender && this.renderPass) {
      this.asyncMountIdx = 0;
      this.asyncRenderIdx = 0;
      const markup = renderToString(this.element);
      if (!this.awaitForAsyncMount) {
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

  getAsyncMountIdx = () => {
    return this.asyncMountIdx++;
  };

  storeAsyncMountResult = (idx, data) => {
    this.asyncMountResults[idx] = data;
  };

  getAsyncMountResult = idx => {
    return this.asyncMountResults[idx] !== undefined ? this.asyncMountResults[idx] : null;
  };

  addModule(module) {
    this.modules.push(module);
  }

  getModules = (stats) => {
    return extractModules(stats, this.modules);
  };

  getInitialState = () => {
    return { ...this.asyncMountResults };
  };
}

export default AsyncRenderer;
