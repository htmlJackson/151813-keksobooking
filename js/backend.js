'use strict';
(function () {
  var LOAD_TIMEOUT = 10000;
  var CODE_SUCCESS = 200;

  var Url = {
    GET: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };

  var setupXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === CODE_SUCCESS) {
        onLoad(xhr.response);
        window.data = xhr.response;
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = LOAD_TIMEOUT; // 10s

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var request = setupXhr(onLoad, onError);
      request.open('GET', Url.GET);
      request.send();
    },

    upload: function (data, onLoad, onError) {
      var request = setupXhr(onLoad, onError);
      request.open('POST', Url.POST);
      request.send(data);
    }
  };
})();
