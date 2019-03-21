let IS_SPY_ON = false;
let LOGS = [];

const realXHR = window.XMLHttpRequest;

function startSpy() {
  if (!realXHR) {
    console.warn('XMLHttpRequest is not supported!');
    return false;
  }
  const realOpen = window.XMLHttpRequest.prototype.open;
  const realSend = window.XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.open = function(...args) {
    const xhr = this;
    console.log(xhr);
    return realOpen.apply(xhr, args);
  };

  window.XMLHttpRequest.prototype.send = function(...args) {
    const xhr = this;
    console.log(xhr);
    return realSend.apply(xhr, args);
  };
}

export { startSpy };
