import { renderToString } from 'react-dom/server';
import extractModules from './extractModules';
import crossReferenceStats from './crossReferenceStats';

class AsyncRenderer {
  modules = {};
  webpackModules = {};

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
    this.context.getChunks = this.getChunks;
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

  addWebpackModules = (name, modules) => {
    const nextModules = {};
    for (let prop in modules) {
      if (modules.hasOwnProperty(prop)) {
        nextModules[prop] = { ...modules[prop], key: name };
      }
    }
    this.webpackModules = { ...this.webpackModules, ...nextModules };
  };

  getInitialState = () => {
    return { ...this.asyncMountResults };
  };

  getChunks = (stats, stats2) => {
    stats = extractModules(stats, this.modules, this.webpackModules, stats2 ? true : false);
    if (stats2) {
      return crossReferenceStats(stats, stats2);
    }
    return stats;
  };

  getModules = (stats, stats2) => {
    const chunks = this.getChunks(stats, stats2);

    const files = [].concat.apply([], chunks.map(module => module.files )).filter(file => !file.match(/\.map$/));
    const modules = [].concat.apply([], chunks.filter(module => module.key).map(module => ({
      key: module.key,
      chunk: module.id,
      module: module.moduleId
    })));

    return { files, modules };
  };
}

export default AsyncRenderer;
