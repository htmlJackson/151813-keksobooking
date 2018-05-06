'use strict';
(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var SHARP_END_HEIGHT = 22; // размер псевдоэлемента-указателя

  var MAP_WIDTH = document.querySelector('.map').offsetWidth;

  var DragCoord = {
    MIN_X: 0,
    MAX_X: MAP_WIDTH - MAIN_PIN_WIDTH,
    MIN_Y: 150,
    MAX_Y: 500
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
    mainPin.removeEventListener('mouseup', enablePage);
    mapSection.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');

    for (var i = 0; i < fieldsetCollection.length; i++) {
      fieldsetCollection[i].disabled = false;
    }

    window.backend.load(window.pins.render, window.util.errorHandler);
    setAddress();
    window.filter.init();
    window.form.validateGuests();
  };

  /**
    * Отключение страницы
  */
  var disablePage = function () {
    mapSection.classList.add('map--faded');
    window.form.adForm.classList.add('ad-form--disabled');

    for (var i = 0; i < fieldsetCollection.length; i++) {
      fieldsetCollection[i].disabled = true;
    }
    mainPin.style.left = PinDefault.LEFT;
    mainPin.style.top = PinDefault.TOP;

    document.querySelector('.map__filters').reset();

    setAddress();
    mainPin.addEventListener('mouseup', enablePage);
    window.popup.close();
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

        if (moveCoords.x <= DragCoord.MIN_X) {
          moveCoords.x = DragCoord.MIN_X;
        }

        if (moveCoords.x > DragCoord.MAX_X) {
          moveCoords.x = DragCoord.MAX_X;
        }

        if (moveCoords.y <= DragCoord.MIN_Y) {
          moveCoords.y = DragCoord.MIN_Y;
        }

        if (moveCoords.y > DragCoord.MAX_Y) {
          moveCoords.y = DragCoord.MAX_Y;
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
