export default array => {
  const stack = [];
  return array.filter(item => {
    const result = stack.indexOf(item.info.filename);
    if (result === -1) {
      stack.push(item.info.filename);
      return true;
    }
    return false;
  });
};
