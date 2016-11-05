import validateStats from '../utils/validateStats';

function parse(module) {
  return {
    id: module.id,
    files: module.files
  };
}

function extractModule(module, stats) {
  if (module.info.type === 'webpack') {
    const match = stats.chunks.find(chunk => module.info.id == chunk.id);
    return match ? parse(match) : match;
  }
}

export default (modules, stats) => {
  validateStats(stats);
  if (modules && Object.prototype.toString.call(modules) === '[object Array]') {
    return modules.map(module => extractModule(module, stats));
  }
  return [];
};
