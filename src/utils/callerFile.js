export default function() {
  const prevPrepareStackTrace = Error.prepareStackTrace;
  try {
    var err = new Error();
    var callerfile;
    var currentfile;

    Error.prepareStackTrace = function (err, stack) { return stack; };
    err.stack.shift();
    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if(currentfile !== callerfile) {
        Error.prepareStackTrace = prevPrepareStackTrace;
        return callerfile;
      }
    }
  } catch (err) {}
  Error.prepareStackTrace = prevPrepareStackTrace;
  return undefined;
}
