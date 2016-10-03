export default (stats, modules) => {
  if (
    (typeof stats === 'undefined' || !stats) ||
    (!stats.modules || Object.prototype.toString.call(stats.modules) !== '[object Array]') ||
    (!stats.chunks || Object.prototype.toString.call(stats.chunks) !== '[object Array]') ||
    (!stats.entrypoints || typeof stats.entrypoints !== 'object')
  ) throw new Error('Stats is malformed.');

  const statModules = [];
  stats.modules.forEach(module => {
    let filter = false;
    let key;
    for (let prop in modules) {
      if (modules.hasOwnProperty(prop)) {
        if (module.identifier.indexOf(modules[prop]) === (module.identifier.length - modules[prop].length)) {
          filter = true;
          key = prop;
          break;
        }
      }
    }
    if (filter) {
      statModules.push({
        ...module,
        key
      });
    }
    return false;
  });

  modules = statModules;

  let chunks = [];
  modules.forEach(module => {
    module.chunks.forEach(chunkId => {
      const chunk = stats.chunks.find(chunk => chunk.id === chunkId);
      chunk.moduleId = module.id;
      chunk.key = module.key;
      chunks.push(chunk);
    })
  })

  for (let prop in stats.entrypoints) {
    if (stats.entrypoints.hasOwnProperty(prop)) {
      stats.entrypoints[prop].chunks.forEach(chunkId => {
        chunks.push(stats.chunks.find(chunk => chunk.id === chunkId));
      });
    }
  }

  return chunks;
};
