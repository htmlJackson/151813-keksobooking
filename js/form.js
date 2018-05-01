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

  /**
    * Изменение селекта
  */
  var selectChangeHandler = function () {
    form.validateGuests();
  };

  var selectRoomNumber = document.querySelector('select#room_number');
  var selectCapacity = document.querySelector('select#capacity');

  var selectType = document.querySelector('select#type');
  var inputPrice = document.querySelector('input#price');

  var selectTimeIn = document.querySelector('select#timein');
  var selectTimeOut = document.querySelector('select#timeout');

  var adForm = document.querySelector('.ad-form');
  var inputAddress = adForm.querySelector('#address');

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
  }
})();
