export default function() {
  return typeof global === 'object' && typeof process === 'object'
    && Object.prototype.toString.call(process) === '[object process]';
}
