import validateStats from '../utils/validateStats';

function extractModule(module, stats) {
  if (module.info.type === 'webpack') {
    return stats.chunks.find(chunk => module.info.id == chunk.id);
  }
}

export default (modules, stats) => {
  validateStats(stats);
  return modules.map(module => extractModule(module, stats));
};
