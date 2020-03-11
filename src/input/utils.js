let hiddenTextarea;
let hiddenStyles = `
  visibility: hidden !important;
  z-index: -1000 !important;
  position: absolute;
  top: 0;
  left: 0;
  opactity: 0;
  height: 0
`
let contextStyles = [
  'white-spacing',
  'word-break',
  'font-size',
  'font-weight',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-width',
  'line-height',
]
export const calculateTextareaStyle = function (dom, minRows, maxRows) {
  // 总体步骤
  // 获取当前输入下textarea的高度
  // 获取单行textarea的高度
  // 通过与minrows和maxrows的比较完成计算

  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body && document.body.appendChild(hiddenTextarea);
  }

  let {
    boxSizing,
    paddingSize,
    borderSize,
    contextStyle
  } = calTextareaStyles(dom);

  hiddenTextarea.setAttribute('style', `${hiddenStyles};${contextStyle}`);

  hiddenTextarea.value = dom.value || dom.placeholder || '';
  let height = hiddenTextarea.scrollHeight;

  if (boxSizing === 'content-box') {
    height = height - paddingSize;
  } else if (boxSizing === 'border-box') {
    height = height + borderSize;
  }

  hiddenTextarea.value = '';

  let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  if (minRows != null) {
    let minHeight = singleRowHeight * minRows;
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize; 
    }
    height = Math.max(height, minHeight);
  }

  if (maxRows != null) {
    let maxHeight = singleRowHeight * maxRows;
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize; 
    }
    height = Math.min(height, maxHeight);
  }

  return {
    height: `${height}px`
  }

}

function calTextareaStyles(node) {
  let styles = window.getComputedStyle(node);
  let boxSizing = styles.getPropertyValue('box-sizing');
  let paddingSize = parseFloat(styles.getPropertyValue('padding-top')) + parseFloat(styles.getPropertyValue('padding-bottom'));
  let borderSize = parseFloat(styles.getPropertyValue('border-top-width')) + parseFloat(styles.getPropertyValue('border-bottom-width'));
  let contextStyle = contextStyles.map((item) => `${item}:${styles.getPropertyValue(item)}`).join(';');
  return {
    boxSizing,
    paddingSize,
    borderSize,
    contextStyle
  }
}