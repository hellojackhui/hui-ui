const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function makePrefixMap(styleProp, eventName) {
  const prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes[`Webkit${styleProp}`] = `webkit${eventName}`;
  prefixes[`Moz${styleProp}`] = `moz${eventName}`;
  prefixes[`ms${styleProp}`] = `MS${eventName}`;
  prefixes[`O${styleProp}`] = `o${eventName.toLowerCase()}`;

  return prefixes;
}

function getVendorPrefixes(domSupport, win) {
  const prefixes = {
    animationend: makePrefixMap('Animation', 'AnimationEnd'),
    transitionend: makePrefixMap('Transition', 'TransitionEnd'),
  };

  if (domSupport) {
    if (!('AnimationEvent' in win)) {
      delete prefixes.animationend.animation;
    }

    if (!('TransitionEvent' in win)) {
      delete prefixes.transitionend.transition;
    }
  }

  return prefixes;
}

const vendorPrefixes = getVendorPrefixes(canUseDOM, typeof window !== 'undefined' ? window : {});

let style = {};

if (canUseDOM) {
  style = document.createElement('div').style;
}

const prefixedEventNames = {};

function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  }

  const prefixMap = vendorPrefixes[eventName];

  if (prefixMap) {
    const stylePropList = Object.keys(prefixMap);
    const len = stylePropList.length;
    for (let i = 0; i < len; i += 1) {
      const styleProp = stylePropList[i];
      if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
        prefixedEventNames[eventName] = prefixMap[styleProp];
        return prefixedEventNames[eventName];
      }
    }
  }

  return '';
}
const animationStartName = getVendorPrefixedEventName('animationstart');
const animationEndName = getVendorPrefixedEventName('animationend');

const transitionStartName = getVendorPrefixedEventName('transitionstart');
const transitionEndName = getVendorPrefixedEventName('transitionend');

const exportProperty = {
  animationStartName: animationStartName,
  animationEndName: animationEndName,
  transitionStartName: transitionStartName,
  transitionEndName: transitionEndName,
  supportTransition: !!(animationEndName && transitionEndName)
}

export default exportProperty;

