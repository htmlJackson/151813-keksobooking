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

  var GUESTS_VALIDATE_DATA = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
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
    * Изменение селекта
  */
  var selectChangeHandler = function () {
    window.form.validateGuests();
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
    }, 1000);

  };

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

  selectRoomNumber.addEventListener('change', selectChangeHandler);
  selectCapacity.addEventListener('change', selectChangeHandler);

  adForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adForm), formSubmitHandler, window.util.errorHandler);
    evt.preventDefault();
  });

  adReset.addEventListener('click', function () {
    window.pins.clean();
    window.map.disablePage();
  });


  window.form = {
    adForm: adForm,
    offerData: OFFER_DATA,
    /**
      * Валидация соответствия количества комнат и гостей
    */
    validateGuests: function () {
      var roomValue = selectRoomNumber.value;
      var capacityValue = selectCapacity.value;
      var capacityArray = GUESTS_VALIDATE_DATA[roomValue];
      selectRoomNumber.setCustomValidity('');
      selectRoomNumber.checkValidity();
      if (capacityArray.indexOf(capacityValue) < 0) {
        selectRoomNumber.setCustomValidity('Количество комнат не подходит для количества гостей');
      }
    }
  };
})();
