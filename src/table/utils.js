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


export {
  getScrollbarWidth,
}