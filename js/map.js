'use strict';
(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var SHARP_END_HEIGHT = 22; // размер псевдоэлемента-указателя

  var MAP_WIDTH = document.querySelector('.map').offsetWidth;
  var MAP_HEIGHT = document.querySelector('.map').offsetHeight;

  var MAX_DRAG_COORDS_X = MAP_WIDTH - MAIN_PIN_WIDTH;
  var MAX_DRAG_COORDS_Y = MAP_HEIGHT - MAIN_PIN_HEIGHT - SHARP_END_HEIGHT - document.querySelector('.map__filters-container').offsetHeight;

  var pinsList = document.querySelector('.map__pins');
  pinsList.appendChild(window.pins.render(window.data.adsDataArray));

  var mapSection = document.querySelector('.map');

  var fieldsetCollection = window.form.adForm.querySelectorAll('fieldset');
  var mainPin = document.querySelector('.map__pin--main');
  var pinsElems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  var addressInput = window.form.adForm.querySelector('#address');

  var mainpinMouseupHandler = function () {
    enablePage();
    mainPin.removeEventListener('mouseup', mainpinMouseupHandler);
  };

  /**
    * Активация страницы
  */
  var enablePage = function () {
    mapSection.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');

    for (var i = 0; i < fieldsetCollection.length; i++) {
      fieldsetCollection[i].disabled = false;
    }

    for (var j = 0; j < pinsElems.length; j++) {
      pinsElems[j].style.display = 'block';
    }

    addDragPin();
    setAddress();
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

    for (var j = 0; j < pinsElems.length; j++) {
      pinsElems[j].style.display = 'none';
    }
    setAddress();
    window.popup.close();
  };

  /**
    * Установка адреса относительно текущих координат главного пина
  */
  var setAddress = function () {
    var left = parseInt(mainPin.style.left, 10);
    var top = parseInt(mainPin.style.top, 10);
    var coordsX = left + Math.round(MAIN_PIN_WIDTH / 2);
    var coordsY = top + MAIN_PIN_HEIGHT + SHARP_END_HEIGHT;
    var address = coordsX + ', ' + coordsY;
    addressInput.value = address;
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

        if (moveCoords.x <= 0) {
          moveCoords.x = 0;
        }

        if (moveCoords.x > MAX_DRAG_COORDS_X) {
          moveCoords.x = MAX_DRAG_COORDS_X;
        }

        if (moveCoords.y <= 0) {
          moveCoords.y = 0;
        }

        if (moveCoords.y > MAX_DRAG_COORDS_Y) {
          moveCoords.y = MAX_DRAG_COORDS_Y;
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

  disablePage();

  mainPin.addEventListener('mouseup', mainpinMouseupHandler);

})();
