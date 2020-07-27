// 匹配key是否属于该keylist之中
/**
 * 
 * @param {string} key
 * @param {array} keylist 
 * @param {boolean} accurate 是否精确匹配
 */
export const matchKey = (key = '', keylist = [], accurate = false) => {
  let accurateMatch = exitAccurateKey(key, keylist);
  let blurMatch = keylist.some((itemkey) => itemkey.indexOf(key) > -1);
  return accurate ? accurateMatch : (accurateMatch || blurMatch)
}

const exitAccurateKey = (key, keylist) => {
  if (key === '') return true;
  for (let i = 0; i < keylist.length; i++) {
    let item = keylist[i];
    let splitKeys = item.split('-');
    for (let i = 2; i <= splitKeys.length; i++) {
      let curKeys = splitKeys.slice(0, i).join('-');
      if (curKeys === key) {
        return true;
      }
    }
  }
  return false;
}


export const dipatchParent = (obj, level = 1) => {
  if (level === 0) return obj;
  return dipatchParent(obj.$parent, --level);
} 

// 判断子节点是否全部选中
export const allChecked = (node) => {
  if (!node.children || !node.children.length) return false;
  let existUnchecked = node.children.some((item) => (item.checked === false));
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