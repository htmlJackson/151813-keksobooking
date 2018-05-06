'use strict';
(function () {
  window.filter = function () {

    var PriceRage = {
      LOW: 10000,
      HIGH: 50000
    };

    var mapFilters = document.querySelector('.map__filters');
    var filterSelects = mapFilters.querySelectorAll('select');
    var filterInputs = mapFilters.querySelectorAll('input');
    var Filter = {
      type: mapFilters.querySelector('#housing-type'),
      price:  mapFilters.querySelector('#housing-price'),
      rooms: mapFilters.querySelector('#housing-rooms'),
      guests: mapFilters.querySelector('#housing-guests')
    };

    var Feauture = {
      wifi: document.querySelector('#filter-wifi'),
      dishwasher: document.querySelector('#filter-dishwasher'),
      parking: document.querySelector('#filter-parking'),
      washer: document.querySelector('#filter-washer'),
      elevator: document.querySelector('#filter-elevator'),
      conditioner: document.querySelector('#filter-conditioner')
    };

    var data = window.data.slice();

    var isType = function (elem) {
      return (Filter.type.value === elem.offer.type || Filter.type.value === 'any');
    };

    var isPrice = function (elem) {
      var priceKey = {
        any: true,
        low: (elem.offer.price < PriceRage.LOW),
        middle: (elem.offer.price < PriceRage.HIGH && elem.offer.price > PriceRage.LOW),
        high: (elem.offer.price > PriceRage.HIGH)
      };
      return priceKey[Filter.price.value];
    };

    var isRooms = function (elem) {
      return (+Filter.rooms.value === elem.offer.rooms || Filter.rooms.value === 'any');
    };

    var isGuests = function (elem) {
      return (+Filter.guests.value === elem.offer.guests || Filter.guests.value === 'any');
    };

    var isFeatures = function (elem) {

      if (Feauture.wifi.checked) {
        return elem.offer.features.includes(Feauture.wifi.value);
      }

      if (Feauture.dishwasher.checked) {
        return elem.offer.features.includes(Feauture.dishwasher.value);
      }

      if (Feauture.parking.checked) {
        return elem.offer.features.includes(Feauture.parking.value);
      }

      if (Feauture.washer.checked) {
        return elem.offer.features.includes(Feauture.washer.value);
      }

      if (Feauture.elevator.checked) {
        return elem.offer.features.includes(Feauture.elevator.value);
      }

      if (Feauture.conditioner.checked) {
        return elem.offer.features.includes(Feauture.conditioner.value);
      }

      return true;
    };

    var isFeat = function (elem) {


    };

    var getFilteredPins = function () {
      window.popup.close();
      var filteredData = data;

      filteredData = filteredData.filter(isType);
      filteredData = filteredData.filter(isPrice);
      filteredData = filteredData.filter(isRooms);
      filteredData = filteredData.filter(isGuests);
      //filteredData = filteredData.filter(isFeatures);
      filterInputs.forEach(function (it) {
        filteredData = filteredData.filter(function (elem) {
          if (it.checked) {
            return elem.offer.features.includes(it.value);
          }
          return true;
        });
      });

      window.pins.clean();
      window.pins.render(filteredData);
      window.pins.show();
    };

    filterSelects.forEach(function (it) {
      it.addEventListener('change', getFilteredPins);
    });

  filterInputs.forEach(function (it) {
    it.addEventListener('change', getFilteredPins);
  });

  };

})();
