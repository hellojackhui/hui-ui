let draggable = false;

function dragFunction(element, options) {
  const downfn = function(e) {
    if (options.drag) {
      options.drag(e);
    }
  }
  const upfn = function(event) {
    document.removeEventListener('mousemove', downfn);
    document.removeEventListener('mouseup', upfn);
    document.onselectstart = null;
    document.ondragstart = null;
    draggable = false;
    if (options.end) {
      options.end(event)
    }
  }
  element.addEventListener('mousedown', (event) => {
    if (draggable) return;
    document.onselectstart = function() {
      return false;
    }
    document.ondragstart = function() {
      return false;
    }
    document.addEventListener('mousemove', downfn);
    document.addEventListener('mouseup', upfn);
    draggable = true;
    if (options.start) {
      options.start(event);
    }
  })
}

export default dragFunction;