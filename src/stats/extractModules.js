import validateStats from '../utils/validateStats';

function extractModule(module, stats) {
  if (module.info.type === 'webpack') {
    return stats.chunks.find(chunk => module.info.id == chunk.id);
  }
}

export default (modules, stats) => {
  validateStats(stats);
  if (modules && Object.prototype.toString.call(modules) === '[object Array]') {
    return modules.map(module => extractModule(module, stats));
  }
  return [];
};
