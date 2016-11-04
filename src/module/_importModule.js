import isNode from './utils/isNode';
import callerFile from './utils/callerFile';
import dirname from './utils/dirname';
import join from './utils/join';
import shallowDiff from './utils/shallowDiff';
import moduleTraverser from './module/moduleTraverser';
import { add, exists, fetch, extractNameFromImportTransformer } from './module/moduleCache';

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
  if (exists(module, systemImport)) {
    return fetch(module, systemImport);
  }
  const funcString = systemImport.toString();
  systemImport = systemImport()
    .then((a) => {
      moduleTraverser(module);
      return a;
    })
  if (isNode()) {
    const asyncRenderer = modules.asyncRenderer;
    modules.asyncRenderer = null;

    const matches = funcString.match(/\/\* System\.import \*\/\(([^\)]*)\)/);
    console.log(funcString);
    if (matches) {
      // we don't need the path for this one!
      path = addDefaultExtension(join(dirname(callerFile()), matches[1]));
    } else {
      // todo: can we try removing the path from here?, this would allow us to remove the need for path entirely
      path = addDefaultExtension(join(dirname(callerFile()), path));
    }
    if (asyncRenderer) asyncRenderer.addModule(name, path);
    return systemImport;
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
