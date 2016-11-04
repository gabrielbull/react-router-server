import dirname from '../utils/dirname';
import shallowDiff from '../utils/shallowDiff';
import join from '../utils/join';

export const extractModuleList = () => {
  const traversed = {};
  const finalModules = [];

  function traverse(module) {
    if (!traversed[module.id]) {
      traversed[module.id] = true;
      finalModules.push({
        id: module.id,
        filename: module.filename,
        loaded: module.loaded,
      });
      if (module.parent && !traversed[module.parent.id]) traverse(module.parent);
      if (module.children) {
        module.children.forEach(module => {
          if (!traversed[module.id]) traverse(module);
        })
      }
    }
  }

  traverse(module);
  return finalModules;
};

export const isWebpack = loadFunc => {
  return loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/) ? true : false;
};

export const isSystemImportTransformer = loadFunc => {
  return loadFunc.match(/ImportTransformer/) ? true : false;
};

export const infoFromWebpack = () => {
  const matches = funcString.match(/\/\* System\.import \*\/\(([^\)]*)\)/);
};

export const infoFromSystemImportTransformer = (loadFunc, module) => {
  const matches = loadFunc.match(/require\(([^)\]]*)\)/);
  let file = matches[1].replace(/[\('"\\]*/g, '');
  return {
    filename: join(dirname(module.parent.filename), file)
  };
};

export default (currentModule, loadFunc) => {
  loadFunc = loadFunc.toString();
  let finalModule = {};
  if (isSystemImportTransformer(loadFunc)) {
    finalModule = {
      type: 'systemImportTransformer',
      ...finalModule,
      ...infoFromSystemImportTransformer(loadFunc, currentModule)
    };
  } else if (isWebpack(loadFunc)) {

  }

  return () => {
    return finalModule;
  };
};
