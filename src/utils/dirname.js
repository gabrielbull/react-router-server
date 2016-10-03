export default function (path) {
  const indexOfSlash = __dirname.indexOf('/');
  const indexOfBackslash = __dirname.indexOf('\\');
  let separator;
  if (indexOfBackslash === -1 || indexOfSlash > indexOfBackslash) {
    separator = '/';
  } else {
    separator = '\\';
  }
  const parts = path.split(separator);
  parts.pop();
  return parts.join(separator);
}
