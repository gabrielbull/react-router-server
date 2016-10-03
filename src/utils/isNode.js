export default function() {
  return typeof global !== 'undefined'
    && ({}).toString.call(global) === '[object global]';
}
