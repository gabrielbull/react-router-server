import validateStats from '../utils/validateStats';

export function extractChunks(stats, modules) {
  let chunkIds = [];
  let chunks = [];
  modules.forEach(module => {
    module.chunks.forEach(chunkId => {
      const chunk = stats.chunks.find(chunk => chunk.id === chunkId);
      if (chunkIds.indexOf(chunk.id) === -1) {
        const nextChunk = { ...module, ...chunk };
        nextChunk.moduleId = module.id;
        nextChunk.key = module.key;
        chunks.push(nextChunk);
      }
    })
  })
  return chunks;
}

export function extractEntry(stats) {
  let chunkIds = [];
  const chunks = [];
  for (let prop in stats.entrypoints) {
    if (stats.entrypoints.hasOwnProperty(prop)) {
      stats.entrypoints[prop].chunks.forEach(chunkId => {
        if (chunkIds.indexOf(chunkId) === -1) {
          chunks.push(stats.chunks.find(chunk => chunk.id === chunkId));
          chunkIds.push(chunkId);
        }
      });
    }
  }
  return chunks;
}


function extractModule(module, stats) {
  if (module.info.type === 'webpack') {
    return stats.chunks.find(chunk => module.info.id == chunk.id);
  }
}

export default (modules, stats1, stats2 = null) => {
  validateStats(stats1);
  if (!stats2) {
    const finalModules = modules.map(module => extractModule(module, stats1));
    console.log(finalModules);
  } else {
    validateStats(stats2);
  }
};

export const deprecated = (stats, modules, webpackModules, ignoreEntry = false) => {
  validateStats(stats);

  const statModules = [];
  stats.modules.forEach(module => {
    let filter = false;
    let key;
    if (webpackModules[module.id]) {
      filter = true;
      key = webpackModules[module.id].key;
    } else {
      for (let prop in modules) {
        if (modules.hasOwnProperty(prop)) {
          if (module.identifier.indexOf(modules[prop]) === (module.identifier.length - modules[prop].length)) {
            filter = true;
            key = prop;
            break;
          }
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

  let chunks = extractChunks(stats, statModules);

  if (!ignoreEntry) {
    chunks.push(...extractEntry(stats));
  }

  return chunks;
};
