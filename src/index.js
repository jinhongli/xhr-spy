let IS_SPY_ON = false;
let LOGS = [];

let _open;
let _send;

function insertLog(log) {
  console.log(log);
  LOGS.push(log);
}

function startSpy() {
  if (!window.XMLHttpRequest || IS_SPY_ON) return false;
  IS_SPY_ON = true;
  _open = window.XMLHttpRequest.prototype.open;
  _send = window.XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.open = function(...args) {
    const xhr = this;
    xhr.log = {
      method: args[0],
      url: args[1],
    };
    return _open.apply(xhr, args);
  };

  window.XMLHttpRequest.prototype.send = function(...args) {
    const xhr = this;
    const sendTime = Date.now();
    const _onreadystatechange = xhr.onreadystatechange;
    xhr.onreadystatechange = function() {
      switch (xhr.readyState) {
        case 0:
        case 1:
        case 2:
        case 3:
          break;
        case 4:
          Object.assign(xhr.log, {
            status: xhr.status,
            statusText: xhr.statusText,
            time: Date.now() - sendTime,
            data: xhr.response,
          });
          insertLog(xhr.log);
        default:
          break;
      }
      return _onreadystatechange.apply(xhr, args);
    };
    return _send.apply(xhr, args);
  };
}

function stopSpy() {
  window.XMLHttpRequest.prototype.open = _open;
  window.XMLHttpRequest.prototype.send = _send;
}

function getLogs() {
  return LOGS;
}

export { startSpy, stopSpy, getLogs };
