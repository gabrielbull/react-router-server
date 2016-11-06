import { isWebpack, getWebpackId } from './info';

let pool = {};
const signature = (module, systemImport) => {
  const loadFunc = systemImport.toString();
  if (isWebpack(loadFunc)) {
    return getWebpackId(loadFunc);
  }
  return (`${module.parent.id}_${systemImport.toString()}`).replace(/[\(\)]/g, '_').replace(/[^0-9a-zA-Z\/_\\]/g, '');
}
export const add = (module, systemImport, result) => {
  const key = signature(module, systemImport);
  if (key !== null) pool[key] = result;
}
export const fetch = (module, systemImport) => {
  const key = signature(module, systemImport);
  if (key !== null) return pool[key];
  return null;
}
export const exists = (module, systemImport) => {
  const key = signature(module, systemImport);
  if (key !== null) pool[signature(module, systemImport)] !== undefined;
  return false;
}
export const all = () => pool;
