export default function (systemImport, importCallback) {
  return new Promise((resolve, reject) => {
    global.window = {};
    global.document = {
      getElementsByTagName: () => [
        {
          appendChild: (element) => {
            setTimeout(() => {
              importCallback(element.src)
                .then(() => {
                  element.onload();
                })
            });
          }
        }
      ],
      createElement: () => ({})
    };
    systemImport()
      .then(module => {
        global.webpackJsonpapp = global.window.webpackJsonpapp;
        resolve(module);
      })
      .catch(reject);
  });
}
