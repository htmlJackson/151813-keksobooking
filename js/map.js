'use strict';
(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var SHARP_END_HEIGHT = 22; // размер псевдоэлемента-указателя

  var VerticalMapLimit = {
    MIN: 150,
    MAX: 500
  };

  var mapWidth = document.querySelector('.map').offsetWidth;

  var dragCoord = {
    minX: 0,
    maxX: mapWidth - MAIN_PIN_WIDTH,
    minY: VerticalMapLimit.MIN - MAIN_PIN_HEIGHT - SHARP_END_HEIGHT,
    maxY: VerticalMapLimit.MAX - MAIN_PIN_HEIGHT - SHARP_END_HEIGHT
  };

  var mapSection = document.querySelector('.map');
  var fieldsetCollection = window.form.adForm.querySelectorAll('fieldset');
  var mainPin = document.querySelector('.map__pin--main');
  var addressInput = window.form.adForm.querySelector('#address');

  var PinDefault = {
    LEFT: mainPin.style.left,
    TOP: mainPin.style.top
  };

  /**
    * Активация страницы
  */
  var enablePage = function () {
    mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
    mapSection.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');

    Array.from(fieldsetCollection).forEach(function (it) {
      it.disabled = false;
    });

    window.backend.load(window.pins.render, window.util.errorHandler);
    setAddress();
    window.filter.init();
  };

  /**
    * Отключение страницы
  */
  var disablePage = function () {
    mapSection.classList.add('map--faded');
    window.form.adForm.classList.add('ad-form--disabled');

    Array.from(fieldsetCollection).forEach(function (it) {
      it.disabled = true;
    });

    mainPin.style.left = PinDefault.LEFT;
    mainPin.style.top = PinDefault.TOP;

    document.querySelector('.map__filters').reset();

    setAddress();
    mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
    window.popup.close();
  };

  /**
    * Отпускание главного пина
    @param {Object} evt - объект события
  */
  var mainPinMouseUpHandler = function (evt) {
    evt.preventDefault();
    enablePage();
  };

  /**
    * Установка адреса относительно текущих координат главного пина
    * @return {string} - адрес
  */
  var setAddress = function () {
    var left = parseInt(mainPin.style.left, 10);
    var top = parseInt(mainPin.style.top, 10);
    var coordsX = left + Math.round(MAIN_PIN_WIDTH / 2);
    var coordsY = top + MAIN_PIN_HEIGHT + SHARP_END_HEIGHT;
    var address = coordsX + ', ' + coordsY;
    addressInput.value = address;
    return address;
  };

  /**
    * Добавление перетаскивания главного пина
  */
  var addDragPin = function () {
    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var moveCoords = {
          x: mainPin.offsetLeft - shift.x,
          y: mainPin.offsetTop - shift.y
        };

        if (moveCoords.x <= dragCoord.minX) {
          moveCoords.x = dragCoord.minX;
        }

        if (moveCoords.x > dragCoord.maxX) {
          moveCoords.x = dragCoord.maxX;
        }

        if (moveCoords.y <= dragCoord.minY) {
          moveCoords.y = dragCoord.minY;
        }

        if (moveCoords.y > dragCoord.maxY) {
          moveCoords.y = dragCoord.maxY;
        }

        mainPin.style.top = moveCoords.y + 'px';
        mainPin.style.left = moveCoords.x + 'px';
        setAddress();
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
  };

  addDragPin();
  disablePage();

  window.map = {
    mainPin: mainPin,
    enablePage: enablePage,
    defaultAddress: setAddress(),
    disablePage: disablePage
  };

})();
