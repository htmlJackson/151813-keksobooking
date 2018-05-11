'use strict';
(function () {
  var OFFER_DATA = {
    flat: {
      translate: 'Квартира',
      minPrice: 1000
    },
    bungalo: {
      translate: 'Бунгало',
      minPrice: 0
    },
    house: {
      translate: 'Дом',
      minPrice: 5000
    },
    palace: {
      translate: 'Дворец',
      minPrice: 10000
    },
  };

  var adForm = document.querySelector('.ad-form');
  var adReset = document.querySelector('.ad-form__reset');
  var selectRoomNumber = document.querySelector('#room_number');
  var selectCapacity = document.querySelector('#capacity');

  var selectType = document.querySelector('#type');
  var inputPrice = document.querySelector('#price');

  var selectTimeIn = document.querySelector('#timein');
  var selectTimeOut = document.querySelector('#timeout');

  /**
    * Функция определения выбранного селекта количества комнат.
    * @param {number} room количество комнат у выбранного селекта
    * @param {number} capacity количество мест в комнатах
    * @return {boolean} Возвращает true, если комнат 100.
  */
  var isRoomNumber100 = function (room, capacity) {
    return (room === '100' && capacity === '0');
  };

  /**
    * Функция определения выбранного селекта количества комнат.
    * @param {number} room количество комнат у выбранного селекта
    * @param {number} capacity количество мест в комнатах
    * @return {boolean} Возвращает true, если комнат не 100.
  */
  var isRoomNumber123 = function (room, capacity) {
    return (room >= capacity && capacity !== '0' && room !== '100');
  };

  /**
    * Отправка формы
  */
  var formSubmitHandler = function () {
    var successBlock = document.querySelector('.success');
    successBlock.classList.remove('hidden');

    setTimeout(function () {
      successBlock.classList.add('hidden');
      adForm.reset();
      document.querySelector('#address').value = window.map.defaultAddress;
      window.pins.clean();
      window.map.disablePage();
      window.file.clean();
    }, 1000);

  };

  for (var i = 0; i < selectCapacity.length; i++) {
    if (selectCapacity[i].value === '1') {
      selectCapacity[i].disabled = false;
      selectCapacity[i].selected = true;
    } else {
      selectCapacity[i].disabled = true;
    }
  }

  selectRoomNumber.addEventListener('change', function () {
    var selectedRoomNumber = selectRoomNumber.value;
    for (var j = 0; j < selectCapacity.length; j++) {
      if (isRoomNumber123(selectedRoomNumber, selectCapacity[j].value) || isRoomNumber100(selectedRoomNumber, selectCapacity[j].value)) {
        selectCapacity[j].disabled = false;
        selectCapacity[j].selected = true;
      } else {
        selectCapacity[j].disabled = true;
      }
    }
  });

  selectType.addEventListener('change', function () {
    var value = selectType.value;
    inputPrice.min = OFFER_DATA[value].minPrice;
    inputPrice.placeholder = OFFER_DATA[value].minPrice;
  });

  selectTimeIn.addEventListener('change', function () {
    selectTimeOut.value = selectTimeIn.value;
  });

  selectTimeOut.addEventListener('change', function () {
    selectTimeIn.value = selectTimeOut.value;
  });

  adForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adForm), formSubmitHandler, window.util.errorHandler);
    evt.preventDefault();
  });

  adReset.addEventListener('click', function () {
    window.pins.clean();
    window.map.disablePage();
    window.file.clean();
  });

  window.form = {
    adForm: adForm,
    offerData: OFFER_DATA
  };
})();
