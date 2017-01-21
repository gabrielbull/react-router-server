import renderPass from './renderPass';

export default (element) => {
  return new Promise((resolve, reject) => {
    const context = {
      resolve, reject,
      modulesLoading: 0,
      fetchingStates: 0
    };
    renderPass(context, element, true);
  });
};
