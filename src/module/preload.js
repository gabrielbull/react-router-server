import { getWebpackId } from './info';

const pool = {};

const signature = (module, systemImport) => getWebpackId(systemImport.toString());
export const fetch = (module, systemImport) => pool[signature(module, systemImport)];
export const exists = (module, systemImport) => pool[signature(module, systemImport)] !== undefined;

const loadScript = url => {
  return new Promise(resolve => {
    if (!url.match(/\.map$/)) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onreadystatechange = resolve(script);
      script.onload = resolve(script);
      head.appendChild(script);
    } else {
      resolve(null);
    }
  });
}

const fetchModuleInformation = modules => {
  return new Promise((resolve) => {
    const prevWebpackJsonp = webpackJsonp;
    const finalModules = {};
    let fileLoading = 0;
    const scripts = [];

    const finish = () => {
      scripts.forEach(script => script.parentElement.removeChild(script));
      webpackJsonp = prevWebpackJsonp;
      resolve(finalModules);
    };

    webpackJsonp = (ids, modules) => {
      let index = -1;
      for (let prop in modules) {
        if (modules.hasOwnProperty(prop)) {
          index++;
          finalModules[ids[index]] = prop;
        }
      }
      if (fileLoading === 0) {
        finish();
      }
    };

    modules.forEach(module => {
      module.files.forEach(file => {
        fileLoading++;
        loadScript(file)
          .then(script => {
            fileLoading--;
            if (script) scripts.push(script);
          });
      })
    })
  });
};

const loadWebpackModules = (modules) => {
  return new Promise((resolve) => {
    let moduleLoading = 0;
    for (let prop in modules) {
      if (modules.hasOwnProperty(prop)) {
        moduleLoading++;
        __webpack_require__.e(prop)
          .then(__webpack_require__.bind(null, modules[prop]))
          .then(m => {
            moduleLoading--;
            pool[prop] = m;
            if (moduleLoading === 0) {
              resolve(pool);
            }
          });
      }
    }
  });
}

export default (modules) => {
  return new Promise((resolve) => {
    fetchModuleInformation(modules)
      .then(loadWebpackModules)
      .then(resolve)
  });
};
