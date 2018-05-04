'use strict';
(function () {
    var mapFilters = document.querySelector('.map__filters');
    var typeFilter = mapFilters.querySelector('#housing-type');

    typeFilter.addEventListener('change', function () {
      var data = (window.backend.data).slice();
      var filteredData = [];
      window.filteredData = filteredData;
      data.forEach(function (it, i) {
        if ( typeFilter.value === it.offer.type || typeFilter.value === 'any') {
          window.pins.elems[i].style.display = 'block';
        }
      });
      console.log(filteredData);
      window.pins.clean();
      window.pins.render(filteredData);
      window.pins.show();
    });

})();
