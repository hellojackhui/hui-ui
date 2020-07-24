// 封装ajax

const getError = function(action, xhr = new XMLHttpRequest()) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.status} ${xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.status} ${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }
  let err = new Error(msg);
  err.status = xhr.status;
  err.url = action;
  err.method = 'post';
  return err;
}

const getBody = function(xhr = new XMLHttpRequest()) {
  let text = xhr.responseText || xhr.response;
  if (!text) return text;
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

export default function upload(options) {
  if (typeof window !== `undefined` && !window.XMLHttpRequest) return;
  let xhr = new XMLHttpRequest();
  let action = options.action;
  //  xhr上传的进度监听
  if (xhr.upload) {
    xhr.upload.onprogress = function(e) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }
        options.onProgress(e);
      }
  }
  //  xhr捕获错误
  xhr.onError = function(e) {
    options.onError(e);
  }
  //  xhr请求完成监听
  xhr.onload = function(e) {
    if (xhr.status < 200 || xhr.status >= 300) {
      options.onError(getError(action, xhr))
    }
    options.onSuccess(getBody(xhr))
  }
  // 处理formdata
  let formData = new FormData();

  if (options.data) {
    for (let key in options.data) {
      formData.append(key, options.data[key])
    }
  }

  formData.append(options.filename, options.file);

  xhr.open('post', action, true);

  if (options.withCredentials && 'withCredentials' in xhr) {
     xhr.withCredentials = true;
  }

  if (options.headers) {
    for (let key in options.headers) {  
      if (options.headers[key] != null) {
        xhr.setRequestHeader(key, options.headers[key]);
      }
    }
  }
  xhr.send(formData);
  return xhr;
}