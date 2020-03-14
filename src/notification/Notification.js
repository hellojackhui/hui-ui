import React from 'react';
import ReactDOM from 'react-dom';
import NotificationItem from './NotificationItem';

export default function Notification(props = {}, type) {
  // 首先确定notification的dom结构
  // 传参数
  // 绑定unmount事件，将notification所有元素的top进行修改
  // 挂载react

  const div = document.createElement('div');
  div.className = 'hui-notification-wrap'
  document.body.appendChild(div);

  if (typeof props === 'string') {
    props = {
      msg: props
    }
  }

  if (type) {
    props.type = type;
  }

  if (!props.offset) {
    props.offset = 0;
  }

  const instances = document.querySelectorAll('.hui-notification-wrap');
  const lastInstance = instances[instances.length - 1];
  // props.top = (lastInstance ? (parseInt(lastInstance.style.top) + lastInstance.offsetHeigtht) : props.offset) + 16;
  props.top = instances.length > 1 ? (instances.length - 1) * 104 + 16 : 16; 

  const element = React.createElement(NotificationItem, Object.assign(props, {
    willUnmount(height, top) {
      // 卸载dom
      // 调整top
      document.body.removeChild(div)
      requestAnimationFrame(() => {
        const container = document.querySelectorAll('.hui-notification');
        let len = container.length;
        for (let i = 0; i < len; i++) {
          let dom = container[i];
          let domtop = parseInt(dom.style.top);
          if (domtop > top) {
            dom.style.top = `${domtop - height - 10}px`
          }
        }
      })
    }
  }))
  ReactDOM.render(element, div);
}

['info', 'warning', 'success', 'error'].forEach((item) => {
  Notification[item] = (props) => {
    return Notification(props, item);
  }
})