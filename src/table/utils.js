function getScrollbarWidth() {
  let oDiv = document.createElement('div'), //创建一个div
    styles = {
      width: '100px',
      height: '100px',
      overflowY: 'scroll' //让他有滚动条
    },
    i, scrollbarWidth;
  for (i in styles) oDiv.style[i] = styles[i];
  document.body.appendChild(oDiv); //把div添加到body中
  scrollbarWidth = oDiv.offsetWidth - oDiv.clientWidth; //相减
  oDiv.parentNode.removeChild(oDiv);
  return scrollbarWidth; //返回滚动条宽度
}

function isObject(obj) {
  return obj !== null && Object.prototype.toString.call(obj) === "[object Object]";
}

function isSameJSON(json1, json2) {
  if (json1 !== json2) {
    if (Array.isArray(json1) && Array.isArray(json2)) {
      if (json1.length != json2.length) {
        return false;
      }
      for (let i = 0; i < json1.length; i++) {
        if (!isSameJSON(json1[i], json2[i])) {
          return false;
        }
      }
    } else if (isObject(json1) && isObject(json2)) {
      let keys = Object.keys(json1);
      if (keys.length != Object.keys(json2).length) {
        return false;
      }
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (!isSameJSON(json1[key], json2[key])) {
          return false;
        }
      }
    } else if(typeof json1 === 'function' && typeof json2 === 'function') {
      let fnRe = /^(function)?\s*[\w$]*/;
      return (json1.toString().replace(fnRe, '') === json2.toString().replace(fnRe, ''));
    } else {
      return false;
    }
  }
  return true;
}

function createUniqueId() {
  return String(Math.random()).replace('0.', 'id');
}

export {
  getScrollbarWidth,
  isSameJSON,
  createUniqueId,
}