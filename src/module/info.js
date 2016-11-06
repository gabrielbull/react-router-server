import dirname from '../utils/dirname';
import join from '../utils/join';

export const isWebpack = loadFunc => {
  return loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/) ? true : false;
};

export const isSystemImportTransformer = loadFunc => {
  return loadFunc.match(/ImportTransformer/) ? true : false;
};

export const getWebpackId = loadFunc => {
  const matches = loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  return null;
};

export const infoFromWebpack = loadFunc => ({
  id: getWebpackId(loadFunc)
});

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
    finalModule = {
      type: 'webpack',
      ...finalModule,
      ...infoFromWebpack(loadFunc)
    };
  }

  return () => {
    return finalModule;
  };
};
