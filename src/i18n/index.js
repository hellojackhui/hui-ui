import defaultLang from './lang/zh-CN';
import stringFormat from './format';

let lang = defaultLang;

function use(newlang) {
  lang = newlang;
}

function t(path, options) {
  const array = path.split('.');
  let _currentlang = lang;
  for (let i = 0; i < array.length; i++) {
    let property = array[i];
    let value = _currentlang[property];
    if (i === array.length - 1) return stringFormat(value, options);
    if (!value) return '';
    _currentlang = value;
  }
  return '';
}

export default {
  use,
  t,
}