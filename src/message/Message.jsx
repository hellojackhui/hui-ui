import React from 'react';
import ReactDOM from 'react-dom';
import MessageBox from './MessageBox';

export default function Message(props = {}, type) {
  const div = document.createElement('div');
  let content = document.getElementsByClassName('hui-message__container')[0];
  if (content) {
    content.appendChild(div);
    document.body.appendChild(content);
  } else {
    let wrapper = document.createElement('div');
    wrapper.className = 'hui-message__container';
    wrapper.appendChild(div);
    document.body.appendChild(wrapper);
  }
  if (typeof props == 'string') {
    props = {
      message: props
    }
  }
  if (type) {
    props.type = type;
  }

  const component = React.createElement(MessageBox, Object.assign(props, {
    willUnmount: () => {
      let container = document.getElementsByClassName('hui-message__container')[0];
      ReactDOM.unmountComponentAtNode(div);
      container.removeChild(div);
      if (props.onClose && typeof props.onClose == 'function') {
        props.onClose();
      }
    }
  }))

  ReactDOM.render(component, div);

}


['info', 'success', 'warning', 'error'].forEach((item) => {
  Message[item] = function(props) {
    return Message(props, item)
  }
})