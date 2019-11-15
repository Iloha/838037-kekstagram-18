'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';

  window.upload = function (data, onSuccess, onError) {
    var xhr = window.getXhr(onSuccess, onError);
    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
