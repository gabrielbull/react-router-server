import isNode from './utils/isNode';
import callerFile from './utils/callerFile';
import dirname from './utils/dirname';
import join from './utils/join';
import shallowDiff from './utils/shallowDiff';

let modules = {
  registeredModules: {},
  registeredWebpackModules: {},
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
    const asyncRenderer = modules.asyncRenderer;
    modules.asyncRenderer = null;

    if (typeof __webpack_require__ === 'function') {
      if (asyncRenderer) {
        if (modules.registeredWebpackModules[name]) {
          asyncRenderer.addWebpackModules(name, modules.registeredWebpackModules[name]);
        } else {
          const currentModules = { ...__webpack_require__.c };
          systemImport.then(() => {
            const newModules = shallowDiff(currentModules, { ...__webpack_require__.c });
            modules.registeredWebpackModules[name] = newModules;
            asyncRenderer.addWebpackModules(name, newModules);
          });
        }
      }
      return systemImport;
    } else {
      path = addDefaultExtension(join(dirname(callerFile()), path));
      if (asyncRenderer) asyncRenderer.addModule(name, path);
      return systemImport;
    }
  }

  if (modules.registeredModules[name]) {
    const promise = {
      then: (callback) => callback(modules.registeredModules[name]), // todo: try with Promise.resolve()
      catch: () => promise
    };
    return promise;
  }

  return systemImport;
};
