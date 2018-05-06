'use strict';
(function () {
  var ADS_MAX = 5;
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var pinsList = document.querySelector('.map__pins');

  window.pins = {
    /**
      * Генерация DOM-элементов для меток карты
      * @param {Array} dataArray - массив данных
      * @return {Object} - фрагмент для вставки на страницу
    */
    render: function (dataArray) {
      var renderCount = (dataArray.length > ADS_MAX) ? ADS_MAX : dataArray.length;
      for (var i = 0; i < renderCount; i++) {
        var pinDataObject = dataArray[i];
        var pinNode = pinTemplate.cloneNode(true);
        var pinImage = pinNode.querySelector('img');
        pinNode.dataset.id = i;
        pinNode.style.left = pinDataObject.location.x + (pinNode.clientWidth / 2) + 'px';
        pinNode.style.top = pinDataObject.location.y - pinNode.clientHeight + 'px';
        pinNode.style.display = 'none';
        pinImage.src = pinDataObject.author.avatar;
        pinImage.alt = pinDataObject.offer.title;

        pinNode.addEventListener('click', function (evt) {
          evt.preventDefault();
          var target = evt.target;
          var targetId;

          if (target.tagName === 'IMG') {
            targetId = target.parentNode.dataset.id;
          } else {
            targetId = target.dataset.id;
          }

          window.popup.fill(dataArray[targetId]);
          window.popup.open();
        });

        pinsFragment.appendChild(pinNode);
      }
      pinsList.appendChild(pinsFragment);
      window.pins.elems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      return pinsFragment;
    },

    show: function () {
      window.pins.elems.forEach(function (it) {
        it.style.display = 'block';
      });
    },

    hide: function () {
      window.pins.elems.forEach(function (it) {
        it.style.display = 'none';
      });
    },

    clean: function () {
      window.pins.elems.forEach(function (it) {
        pinsList.removeChild(it);
      });
    }
  };

})();
