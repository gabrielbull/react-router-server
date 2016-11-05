export default array => {
  const stack = [];
  return array.filter(item => {
    if (item.info.type === 'webpack') {
      const result = stack.indexOf(item.info.id);
      if (result === -1) {
        stack.push(item.info.id);
        return true;
      }
    } else {
      const result = stack.indexOf(item.info.filename);
      if (result === -1) {
        stack.push(item.info.filename);
        return true;
      }
    }
    return false;
  });
};
