(function () {
  var TITLE_DATA = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var TYPE_DATA = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];
  var TIME_DATA = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES_DATA = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var PHOTOS_DATA = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;

  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;

  var MIN_GUESTS = MIN_ROOMS * 2;
  var MAX_GUESTS = MAX_ROOMS * 2;

  var MIN_COORDS_X = 300;
  var MAX_COORDS_X = 900;

  var MIN_COORDS_Y = 150;
  var MAX_COORDS_Y = 500;

  /**
    * Генерация данных для карточки объявлений
    * @param {number} count - количество объявлений
    * @return {Array} - массив данных
  */
  var generateAdsData = function (count) {
    var adArray = [];
    for (var i = 0; i < count; i++) {
      var coordsX = getRandomInt(MIN_COORDS_X, MAX_COORDS_X);
      var coordsY = getRandomInt(MIN_COORDS_Y, MAX_COORDS_Y);

      var ad = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: TITLE_DATA[i],
          address: coordsX + ', ' + coordsY,
          price: getRandomInt(MIN_PRICE, MAX_PRICE),
          type: getRandomArrayElement(TYPE_DATA),
          rooms: getRandomInt(MIN_ROOMS, MAX_ROOMS),
          guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
          checkin: getRandomArrayElement(TIME_DATA),
          checkout: getRandomArrayElement(TIME_DATA),
          features: getRandomElems(FEATURES_DATA),
          description: '',
          photos: PHOTOS_DATA
        },
        location: {
          x: coordsX,
          y: coordsY
        }
      };
      adArray.push(ad);
    }

    return adArray;
  };
})();
