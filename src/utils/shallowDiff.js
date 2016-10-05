export default function(object1, object2) {
  const diff = {};
  for (let prop in object1) {
    if (object1.hasOwnProperty(prop)) {
      if (typeof object2[prop] === 'undefined') {
        diff[prop] = object1[prop];
      }
    }
  }
  for (let prop in object2) {
    if (object2.hasOwnProperty(prop)) {
      if (typeof object1[prop] === 'undefined') {
        diff[prop] = object2[prop];
      }
    }
  }
  return diff;
}
