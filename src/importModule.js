let modules = {
  registeredModules: {},
  asyncRenderer: null
};

function normalizeModuleName(moduleName) {
  moduleName = moduleName.replace(/\.js$/, '');
  moduleName = moduleName.replace(/^\.?\/?/, '');
  return './' + moduleName;
}

export const registerModule = (name, module) => {
  modules.registeredModules[normalizeModuleName(name)] = module;
};

export const setAsyncRenderer = asyncRenderer => {
  modules.asyncRenderer = asyncRenderer;
};

export default (module, promise) => {
  const asyncRenderer = modules.asyncRenderer;
  modules.asyncRenderer = null;

  module = normalizeModuleName(module);
  if (asyncRenderer) asyncRenderer.addModule(module);
  if (modules.registeredModules[module]) {
    return {
      then: (callback) => callback(modules.registeredModules[module]),
      catch: () => null
    }
  }
  return new Promise((resolve, reject) => {
    promise.then(resolve).catch(reject);
  });
};
