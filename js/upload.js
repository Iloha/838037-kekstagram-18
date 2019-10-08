'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';
  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 4000;
    xhr.responseType = 'json';
    xhr.open('POST', URL);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
    });

    xhr.send(data);
  };
})();
