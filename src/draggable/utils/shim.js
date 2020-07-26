export function findInArray(array, callback) {
  for (let i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i];
  }
}
export function isNum(num) {
  return typeof num === 'number' && !isNaN(num);
}

export function int(a) {
  return parseInt(a, 10);
}