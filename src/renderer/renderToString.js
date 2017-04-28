import renderPass from './renderPass';
import { clear } from '../module/cache';

export default (element) => {
  return new Promise((resolve, reject) => {
    clear();
    const context = {
      resolve, reject,
      modulesLoading: 0,
      fetchingStates: 0
    };
    renderPass(context, element);
  });
};
