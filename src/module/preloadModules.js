import { registerModule } from './importModule';

export default (modules) => {
  return new Promise((resolve) => {
    if (typeof modules !== 'object' || Object.prototype.toString.call(modules) !== '[object Array]' || !modules.length) {
      resolve();
    }

    let idx = 0;
    modules.forEach(module => {
      idx++;
      const modules = {};
      __webpack_require__.e(module.chunk)
        .then(__webpack_require__.bind(null, module.module))
        .then(m => {
          idx--;
          modules[module.key] = m;
          registerModule(module.key, m);
          if (idx === 0) resolve(modules);
        });
    });
  });
};
