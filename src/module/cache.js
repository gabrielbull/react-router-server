import { isWebpack, getWebpackId, isSystemImportTransformer } from './info';
import { caller, dirname, join } from '../utils';

let pool = {};
const signature = (module, systemImport) => {
  const loadFunc = systemImport.toString();
  if (isWebpack(loadFunc) && isSystemImportTransformer(loadFunc)) {
    const parent = dirname(caller()[0].getFileName());
    const id = getWebpackId(loadFunc);
    return `${parent}_${id}`;
  } else if (isWebpack(loadFunc)) {
    return getWebpackId(loadFunc);
  }
  if (typeof module === 'object' && typeof module.parent === 'object' && typeof module.parent.id !== 'undefined') {
    return `${module.parent.id}_${systemImport.toString()}`.replace(/[\(\)]/g, '_').replace(/[^0-9a-zA-Z\/_\\]/g, '');
  }
  return null;
}
export const add = (module, systemImport, result) => {
  const key = signature(module, systemImport);
  if (key !== null) pool[key] = result;
}
export const fetch = (module, systemImport) => {
  const key = signature(module, systemImport);
  if (key !== null && typeof pool[key] !== 'undefined') return pool[key];
  return null;
}
export const exists = (module, systemImport) => {
  const key = signature(module, systemImport);
  return key !== null && typeof pool[key] !== 'undefined';
}
export const all = () => pool;
