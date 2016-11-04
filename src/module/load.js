import { default as info } from './info';

export default (currentModule, load) => {
  const nextInfo = info(currentModule, load);
  return (load) => load.then(loadedModule => {
    const info = nextInfo();
    return { info, module: loadedModule };
  });
};
