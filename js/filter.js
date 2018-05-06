'use strict';
(function () {

  window.filter = function () {
    var PriceRage = {
      LOW: 10000,
      HIGH: 50000
    };

    var mapFilters = document.querySelector('.map__filters');

    var Filter = {
      type: mapFilters.querySelector('#housing-type'),
      price:  mapFilters.querySelector('#housing-price'),
      rooms: mapFilters.querySelector('#housing-rooms'),
      guests: mapFilters.querySelector('#housing-guests')
    };

    var data = window.backend.data.slice(); // ВСЕ ДАННЫЕ

    var filteredData = data;

    Filter.type.addEventListener('change', function () {
      window.popup.close();

      filteredData.forEach(function (it, i) { // Проходим по данным
        if (Filter.type.value === it.offer.type || Filter.type.value === 'any') { // если значение совпадает с выбором селекта ИЛИ выбрано 'any', то эта карточка подходит
          filteredData.push(it); // записываем карточку в новый массив
        }
      });
      window.pins.clean();
      window.pins.render(filteredData); // делаем грязь с новым массивом
      window.pins.show();
      filteredData.type = []; // почистили фильтр

    });

    Filter.price.addEventListener('change', function () {
      window.popup.close();

      filteredData.forEach(function (it, i) {
        if (Filter.price.value === 'any') {
          filteredData.price.push(it);
        }

        if (Filter.price.value === 'low' && it.offer.price < PriceRage.LOW) {
          filteredData.price.push(it);
        }

        if (Filter.price.value === 'middle' && (it.offer.price < PriceRage.HIGH && it.offer.price > PriceRage.LOW)) {
          filteredData.price.push(it);
        }

        if (Filter.price.value === 'high' && it.offer.price > PriceRage.HIGH) {
          filteredData.price.push(it);
        }
      });



      window.pins.clean();
      window.pins.render(filteredData.price);
      window.pins.show();
      filteredData.price = [];
    });
  };

})();
