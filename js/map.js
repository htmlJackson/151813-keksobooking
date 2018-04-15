'use strict';

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

var OFFER_DATA = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

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

var ADS_COUNT = 8;

/**
  * Генерация случайного числа в заданном диапазоне
  * @param {number} min - начало диапазона
  * @param {number} max - конец диапазона
  * @return {number} - случайное число
*/
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
  * Получение случайного элемента массива
  * @param {Array} array - массив
  * @return {string} - элемент массива
*/
var getRandomArrayElement = function (array) {
  var number = getRandomInt(0, array.length);
  return array[number];
};

/**
  * Перемешивание элементов массива
  * @param {Array} array - исходный массив
  * @return {Array} - массив с перемешанными элементами
*/
var shuffleArray = function (array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
  * Получение случайных элементов массива
  * @param {Array} array - исходный массив
  * @return {Array} - массив случайных элементов
*/
var getRandomElems = function (array) {
  var randomArray = shuffleArray(array);
  var count = getRandomInt(0, randomArray.length);
  var resultArray = [];

  for (var i = 0; i <= count; i++) {
    resultArray.push(randomArray[i]);
  }
  return resultArray;
};

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
        photos: shuffleArray(PHOTOS_DATA)
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

/**
  * Генерация DOM-элементов для меток карты
  * @param {Array} dataArray - массив данных
  * @return {Object} - фрагмент для вставки на страницу
*/
var renderPins = function (dataArray) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  for (var i = 0; i < dataArray.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = dataArray[i].location.x + (pinElement.clientWidth / 2) + 'px';
    pinElement.style.top = dataArray[i].location.y - pinElement.clientHeight + 'px';
    pinImage.src = dataArray[i].author.avatar;
    pinImage.alt = dataArray[i].offer.title;

    pinsFragment.appendChild(pinElement);
  }

  return pinsFragment;
};

/**
  * Генерация DOM-элемента карточки-popup
  * @param {Array} dataObject - объект данных
  * @return {Object} - элемент для вставки на страницу
*/
var renderPopup = function (dataObject) {
  var popupTemplate = document.querySelector('template').content.querySelector('.map__card');
  var popupCard = popupTemplate.cloneNode(true);
  var popupPhotos = popupCard.querySelector('.popup__photos');
  var popupImage = popupCard.querySelector('.popup__photo');
  var popupFeatures = popupCard.querySelector('.popup__features');
  var popupFeature = popupCard.querySelector('.popup__feature');
  popupCard.querySelector('.popup__title').textContent = dataObject.offer.title;
  popupCard.querySelector('.popup__text--address').textContent = dataObject.offer.address;
  popupCard.querySelector('.popup__text--price').textContent = dataObject.offer.price + '₽/ночь';
  popupCard.querySelector('.popup__type').textContent = OFFER_DATA[dataObject.offer.type];
  popupCard.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms + ' комнаты для ' + dataObject.offer.guests + ' гостей';
  popupCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObject.offer.checkin + ', выезд до ' + dataObject.offer.checkout;
  popupCard.querySelector('.popup__description').textContent = dataObject.offer.description;
  popupFeatures.textContent = '';
  popupPhotos.textContent = '';

  for (var i = 0; i < dataObject.offer.photos.length; i++) {
    var newImg = popupImage.cloneNode(true);
    newImg.src = dataObject.offer.photos[i];
    popupPhotos.appendChild(newImg);
  }

  for (var j = 0; j < dataObject.offer.features.length; j++) {
    var newFeature = popupFeature.cloneNode(true);
    newFeature.classList = '';
    newFeature.classList.add('popup__feature', 'popup__feature--' + dataObject.offer.features[j]);
    popupFeatures.appendChild(newFeature);
  }

  popupCard.querySelector('.popup__avatar').src = dataObject.author.avatar;
  return popupCard;
};

var adsDataArray = generateAdsData(ADS_COUNT);

var pinsList = document.querySelector('.map__pins');
pinsList.appendChild(renderPins(adsDataArray));

var card = renderPopup(adsDataArray[0]);
document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));

document.querySelector('.map').classList.remove('map--faded');
