'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';

  window.load = function (onSuccess, onError) {
    var xhr = window.getXhr(onSuccess, onError);

    xhr.open('GET', URL);
    xhr.send();
  };

})();
