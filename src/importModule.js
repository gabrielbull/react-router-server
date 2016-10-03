import isNode from './utils/isNode';
import callerFile from './utils/callerFile';
import dirname from './utils/dirname';
import join from './utils/join';

let modules = {
  registeredModules: {},
  asyncRenderer: null
};

export const registerModule = (name, module) => {
  modules.registeredModules[name] = module;
};

export const setAsyncRenderer = asyncRenderer => {
  modules.asyncRenderer = asyncRenderer;
};

function addDefaultExtension(path) {
  if (path.match(/\.([^\/|\\])*$/)) return path;
  return path + '.js';
}

export default (name, path, systemImport) => {
  if (isNode()) {
    path = addDefaultExtension(join(dirname(callerFile()), path));
    const asyncRenderer = modules.asyncRenderer;
    modules.asyncRenderer = null;

    if (asyncRenderer) asyncRenderer.addModule(name, path);
  }

  if (modules.registeredModules[name]) {
    return {
      then: (callback) => callback(modules.registeredModules[name]),
      catch: () => null
    }
  }

  return systemImport;
};
