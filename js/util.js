'use strict';
(function () {
  window.util = {
    /**
      * Сообщение ошибки
      * @param {string} errorMessage - текст ошибки
    */
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'padding: 20px 0; z-index: 100; margin: 0 auto; text-align: center; background-color: #ff5635;color: #fff';
      node.style.position = 'fixed';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.style.cursor = 'pointer';
      node.textContent = 'Упс! Что-то пошло не так! :( ' + errorMessage;
      node.addEventListener('click', function () {
        document.body.removeChild(node);
      });
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
