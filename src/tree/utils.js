// 匹配key是否属于该keylist之中
/**
 * 
 * @param {string} key
 * @param {array} keylist 
 * @param {boolean} accurate 是否精确匹配
 */
export const matchKey = (key = '', keylist = [], accurate = false) => {
  let accurateMatch = keylist.includes(key);
  let blurMatch = keylist.some((itemkey) => itemkey.indexOf(key) > -1);
  return accurate ? accurateMatch : (accurateMatch || blurMatch)
}