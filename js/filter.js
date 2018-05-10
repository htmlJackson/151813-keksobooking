'use strict';
(function () {
  var PriceRage = {
    LOW: 10000,
    HIGH: 50000
  };

  var mapFilters = document.querySelector('.map__filters');

  var filterElem = {
    type: mapFilters.querySelector('#housing-type'),
    price: mapFilters.querySelector('#housing-price'),
    rooms: mapFilters.querySelector('#housing-rooms'),
    guests: mapFilters.querySelector('#housing-guests')
  };

  var filterSelects = mapFilters.querySelectorAll('select');
  var filterInputs = mapFilters.querySelectorAll('input');

  var isType = function (elem) {
    return (filterElem.type.value === elem.offer.type || filterElem.type.value === 'any');
  };

  var isPrice = function (elem) {
    var PriceValue = {
      any: true,
      low: (elem.offer.price < PriceRage.LOW),
      middle: (elem.offer.price <= PriceRage.HIGH && elem.offer.price >= PriceRage.LOW),
      high: (elem.offer.price > PriceRage.HIGH)
    };
    return PriceValue[filterElem.price.value];
  };

  var isRooms = function (elem) {
    return (+filterElem.rooms.value === elem.offer.rooms || filterElem.rooms.value === 'any');
  };

  var isGuests = function (elem) {
    return (+filterElem.guests.value === elem.offer.guests || filterElem.guests.value === 'any');
  };

  var filterChangeHandler = function () {
    var filteredData = window.data.slice();

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

  window.filter = {
    init: function () {

      filterSelects.forEach(function (it) {
        it.addEventListener('change', filterChangeHandler);
      });

      filterInputs.forEach(function (it) {
        it.addEventListener('change', filterChangeHandler);
      });

    }
  };
})();
