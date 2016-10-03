export default function (...paths) {
  const indexOfSlash = __dirname.indexOf('/');
  const indexOfBackslash = __dirname.indexOf('\\');
  let separator;
  if (indexOfBackslash === -1 || indexOfSlash > indexOfBackslash) {
    separator = '/';
    paths = paths.map(path => path.replace(/^\.\//, '/').replace(/\/$/, '').replace(/^\//, ''));
  } else {
    separator = '\\';
    paths = paths.map(path => path.replace(/^\.\\/, '\\').replace(/\\$/, '').replace(/^\\/, ''));
  }
  return separator + paths.join(separator);
}
