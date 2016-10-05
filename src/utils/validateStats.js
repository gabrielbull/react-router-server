export default function (stats) {
  if (
    (typeof stats === 'undefined' || !stats) ||
    (!stats.modules || Object.prototype.toString.call(stats.modules) !== '[object Array]') ||
    (!stats.chunks || Object.prototype.toString.call(stats.chunks) !== '[object Array]') ||
    (!stats.entrypoints || typeof stats.entrypoints !== 'object')
  ) throw new Error('Stats is malformed.');
}
