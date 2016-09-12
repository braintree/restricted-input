'use strict';

var UA = navigator.userAgent;

function isIos(ua) {
  ua = ua || UA;
  return /iPhone|iPod|iPad/.test(ua);
}

module.exports = {
  isIos: isIos
};
