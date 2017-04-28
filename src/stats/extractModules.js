import validateStats from '../utils/validateStats';

function parseWebpack(module) {
  return {
    id: module.id,
    files: module.files
  };
}
function parseSystemImportTransformer(module) {
  return {
    id: module.id,
    files: [module.name]
  };
}

function findModule(module, chunks) {
  const match = chunks.find(chunk => module.info.id == chunk.id);
  if (match) return match;
  for (let i = 0, len = chunks.length; i < len; ++i) {
    if (chunks[i].modules) {
      const match = findModule(module, chunks[i].modules);
      if (match) return match;
    }
  }
  return null;
}

function extractModule(module, stats) {
  if (module.info.type === 'webpack') {
    const match = findModule(module, stats.chunks);
    return match ? parseWebpack(match) : match;
  } else if (module.info.type === 'systemImportTransformer') {
    const match = findModule(module, stats.chunks);
    return match ? parseSystemImportTransformer(match) : match;
  }
}

export default (modules, stats) => {
  validateStats(stats);
  if (modules && Object.prototype.toString.call(modules) === '[object Array]') {
    return modules.map(module => extractModule(module, stats));
  }
  return [];
};
