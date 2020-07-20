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


export const dipatchParent = (obj, level = 1) => {
  if (level === 0) return obj;
  return dipatchParent(obj.$parent, --level);
} 

// 判断子节点是否全部选中
export const allChecked = (node) => {
  if (!node.children || !node.children.length) return false;
  let existUnchecked = node.children.some((item) => item.checked === false);
  if (!!existUnchecked) return false;
  return true;
}

// 判断子节点是否全部不被选中
export const allNotChecked = (node) => {
  if (!node.children || !node.children.length) return true;
  let existChecked = node.children.some((item) => item.checked === true || item.indeterminate === true);
  if (!!existChecked) return false;
  return true;
}