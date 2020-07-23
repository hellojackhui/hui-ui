export const addEvent = (el = document, event, handler, options) => {
  if (!el) return;
  options = {capture: true, ...options};
  if (el.addEventListener) {
    el.addEventListener(event, handler, options);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    el['on' + event] = handler;
  }
}

export const removeEvent = (el = document, event, handler, options) => {
  if (!el) return;
  options = {capture: true, ...options};
  if (el.removeEventListener) {
    el.removeEventListener(event, handler, options);
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    el['on' + event] = null;
  }
}