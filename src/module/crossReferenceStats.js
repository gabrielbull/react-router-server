import validateStats from './utils/validateStats';
import { extractChunks, extractEntry } from './extractModules';

export default function (modules, stats) {
  validateStats(stats);
  const modulesValues = {};
  for (let prop in modules) {
    if (modules.hasOwnProperty(prop)) {
      modulesValues[modules[prop].name] = modules[prop];
    }
  }

  const statModules = [];
  stats.modules.forEach(module => {
    if (modulesValues[module.name]) {
      statModules.push({
        ...module,
        key: modulesValues[module.name].key
      });
    }
  });

  const chunks = extractChunks(stats, statModules);
  chunks.push(...extractEntry(stats));

  return chunks;
}
