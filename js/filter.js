'use strict';
(function () {
  window.filter = function () {
    var PriceRage = {
      LOW: 10000,
      HIGH: 50000
    };

    var mapFilters = document.querySelector('.map__filters');

    var FilterElem = {
      TYPE: mapFilters.querySelector('#housing-type'),
      PRICE: mapFilters.querySelector('#housing-price'),
      ROOMS: mapFilters.querySelector('#housing-rooms'),
      GUESTS: mapFilters.querySelector('#housing-guests')
    };


    var filterSelects = mapFilters.querySelectorAll('select');
    var filterInputs = mapFilters.querySelectorAll('input');

    var isType = function (elem) {
      return (FilterElem.TYPE.value === elem.offer.type || FilterElem.TYPE.value === 'any');
    };

    var isPrice = function (elem) {
      var PriceValue = {
        any: true,
        low: (elem.offer.price < PriceRage.LOW),
        middle: (elem.offer.price < PriceRage.HIGH && elem.offer.price > PriceRage.LOW),
        high: (elem.offer.price > PriceRage.HIGH)
      };
      return PriceValue[FilterElem.PRICE.value];
    };

    var isRooms = function (elem) {
      return (+FilterElem.ROOMS.value === elem.offer.rooms || FilterElem.ROOMS.value === 'any');
    };

    var isGuests = function (elem) {
      return (+FilterElem.GUESTS.value === elem.offer.guests || FilterElem.GUESTS.value === 'any');
    };

    var getFilteredPins = function () {
      var data = window.data.slice();
      var filteredData = data;

      window.popup.close();

      filteredData = filteredData.filter(isType);
      filteredData = filteredData.filter(isPrice);
      filteredData = filteredData.filter(isRooms);
      filteredData = filteredData.filter(isGuests);

      filterInputs.forEach(function (it) {
        filteredData = filteredData.filter(function (elem) {
          if (it.checked) {
            return elem.offer.features.includes(it.value);
          }
          return true;
        });
      });

      window.pins.clean();
      window.debounce(function () {
        window.pins.render(filteredData);
      });
    };

    filterSelects.forEach(function (it) {
      it.addEventListener('change', getFilteredPins);
    });

    filterInputs.forEach(function (it) {
      it.addEventListener('change', getFilteredPins);
    });

  };
})();
