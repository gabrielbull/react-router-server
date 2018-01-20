import dirname from '../utils/dirname';
import join from '../utils/join';
import caller from '../utils/caller';

export const isWebpack = loadFunc => {
  return (
    loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/) ||
    // webpack minimized
    loadFunc.match(/function[^}]*return[^}]*[a-zA-Z]\.[a-zA-Z]\([0-9]*\)\.then\([a-zA-Z]\.bind\(null, ?[0-9]*\)/) ||
    // webpack minimized - arrow function
    loadFunc.match(/\(\)=>[a-zA-Z]\.[a-zA-Z]\([0-9]*\)\.then\([a-zA-Z]\.bind\(null, ?[0-9]*\)/) ||
    // webpack normal
    loadFunc.match(/__webpack_require__/) ||
    // webpack normal
    loadFunc.match(/r\.require\.loader/)
  ) ? true : false;
};

export const isSystemImportTransformer = loadFunc => {
  return loadFunc.match(/ImportTransformer/) ? true : false;
};

export const getWebpackId = loadFunc => {
  let matches = loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // webpack minimized
  matches = loadFunc.match(/function[^}]*return[^}]*[a-zA-Z]\.[a-zA-Z]\(([0-9]*)\)\.then\([a-zA-Z]\.bind\(null, ?[0-9]*\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // webpack normal
  matches = loadFunc.match(/function[^}]*return[^}]*\(([0-9]*)\).then/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // webpack normal - arrow function
  matches = loadFunc.match(/\(\)\s=>\s.*\(([0-9]*)\).then/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // system import
  matches = loadFunc.match(/__webpack_require__\(\(?([0-9]*)\)?\)\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // system import minimized
  matches = loadFunc.match(/Promise\.resolve\(n\(([0-9]*)\)\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  return null;
};

export const infoFromWebpack = loadFunc => ({
  id: getWebpackId(loadFunc)
});

export const infoFromSystemImportTransformer = (loadFunc, module) => {
  const matches = loadFunc.match(/require\(([^)\]]*)/);
  let file = matches[1].replace(/[\[\('"\\]*/g, '');
  let parent;
  try {
    parent = caller()[0].getFileName();
  } catch (err) {
  }
  if (!parent && module && typeof module.parent !== 'undefined' && typeof module.parent.filename !== 'undefined') {
    parent = module.parent.filename;
  }
  return {
    filename: join(dirname(parent), file),
    id: getWebpackId(loadFunc)
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
