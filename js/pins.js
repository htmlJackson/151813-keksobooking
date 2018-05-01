'use strict';
(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  /**
    * Обработчик клика на пине
    * @param {Object} evt - объект события
  */
  var pinClickHandler = function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var targetId;

    if (target.tagName === 'IMG') {
      targetId = target.parentNode.dataset.id;
    } else {
      targetId = target.dataset.id;
    }

    window.popup.fill(window.data.adsDataArray[targetId]);
    window.popup.open();
  };

  window.pins = {
    /**
      * Генерация DOM-элементов для меток карты
      * @param {Array} dataArray - массив данных
      * @return {Object} - фрагмент для вставки на страницу
    */
    render: function (dataArray) {
      for (var i = 0; i < dataArray.length; i++) {
        var pinElement = pinTemplate.cloneNode(true);
        var pinImage = pinElement.querySelector('img');
        pinElement.dataset.id = i;
        pinElement.style.left = dataArray[i].location.x + (pinElement.clientWidth / 2) + 'px';
        pinElement.style.top = dataArray[i].location.y - pinElement.clientHeight + 'px';
        pinImage.src = dataArray[i].author.avatar;
        pinImage.alt = dataArray[i].offer.title;

        pinElement.addEventListener('click', pinClickHandler);
        pinsFragment.appendChild(pinElement);
      }

      return pinsFragment;
    }
  };
})();
