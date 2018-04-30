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

var GUESTS_VALIDATE_DATA = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var SHARP_END_HEIGHT = 22; // размер псевдоэлемента-указателя

var ESC_KEYCODE = 27;

var MAP_WIDTH = document.querySelector('.map').offsetWidth;
var MAP_HEIGHT = document.querySelector('.map').offsetHeight;

var MAX_DRAG_COORDS_X = MAP_WIDTH - MAIN_PIN_WIDTH;
var MAX_DRAG_COORDS_Y = MAP_HEIGHT - MAIN_PIN_HEIGHT - SHARP_END_HEIGHT - document.querySelector('.map__filters-container').offsetHeight;

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
    pinElement.dataset.id = i;
    pinElement.style.left = dataArray[i].location.x + (pinElement.clientWidth / 2) + 'px';
    pinElement.style.top = dataArray[i].location.y - pinElement.clientHeight + 'px';
    pinImage.src = dataArray[i].author.avatar;
    pinImage.alt = dataArray[i].offer.title;

    pinElement.addEventListener('click', pinClickHandler);
    pinsFragment.appendChild(pinElement);
  }

  return pinsFragment;
};

/**
  * Генерация DOM-элемента карточки-popup
  * @return {Object} - элемент для вставки на страницу
*/
var renderPopup = function () {
  var popupTemplate = document.querySelector('template').content.querySelector('.map__card');
  var popupCard = popupTemplate.cloneNode(true);
  var popupCloser = popupCard.querySelector('.popup__close');
  popupCloser.addEventListener('click', popupCloserClickHandler);
  return popupCard;
};

/**
  * Изменение содержимого карточки-popup
  * @param {Object} popup - popup на странице
  * @param {Object} dataObject - объект данных
  * @return {Object} - измененная карточка
*/
var fillPopup = function (popup, dataObject) {
  var popupPhotos = popup.querySelector('.popup__photos');
  var popupImage = popup.querySelector('.popup__photo');
  var popupFeatures = popup.querySelector('.popup__features');
  var popupFeature = popup.querySelector('.popup__feature');
  popup.querySelector('.popup__title').textContent = dataObject.offer.title;
  popup.querySelector('.popup__text--address').textContent = dataObject.offer.address;
  popup.querySelector('.popup__text--price').textContent = dataObject.offer.price + '₽/ночь';
  popup.querySelector('.popup__type').textContent = OFFER_DATA[dataObject.offer.type].translate;
  popup.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms + ' комнаты для ' + dataObject.offer.guests + ' гостей';
  popup.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObject.offer.checkin + ', выезд до ' + dataObject.offer.checkout;
  popup.querySelector('.popup__description').textContent = dataObject.offer.description;
  popupFeatures.textContent = '';
  popupPhotos.textContent = '';

  var photosArray = shuffleArray(dataObject.offer.photos);

  for (var i = 0; i < photosArray.length; i++) {
    var newImg = popupImage.cloneNode(true);
    newImg.src = photosArray[i];
    popupPhotos.appendChild(newImg);
  }

  for (var j = 0; j < dataObject.offer.features.length; j++) {
    var newFeature = popupFeature.cloneNode(true);
    newFeature.classList = '';
    newFeature.classList.add('popup__feature', 'popup__feature--' + dataObject.offer.features[j]);
    popupFeatures.appendChild(newFeature);
  }

  popup.querySelector('.popup__avatar').src = dataObject.author.avatar;

  return popup;
};

/**
  * Обработчик клика на пине
  * @param {Object} evt - объект события
*/
var pinClickHandler = function (evt) {
  evt.preventDefault();
  var target = evt.target;
  var targetId;

  if (target.tagName === 'IMG') {
    targetId = target.parentNode.dataset.id;
  } else {
    targetId = target.dataset.id;
  }

  fillPopup(card, adsDataArray[targetId]);
  openPopup();
};

/**
  * Крестик закрытия
  * @param {Object} evt - объект события
*/
var popupCloserClickHandler = function (evt) {
  evt.preventDefault();
  closePopup();
};

var adsDataArray = generateAdsData(ADS_COUNT);

var pinsList = document.querySelector('.map__pins');
pinsList.appendChild(renderPins(adsDataArray));

var mapSection = document.querySelector('.map');
var card = renderPopup();
document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));

var adForm = document.querySelector('.ad-form');
var fieldsetCollection = adForm.querySelectorAll('fieldset');
var mainPin = document.querySelector('.map__pin--main');
var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
var addressInput = adForm.querySelector('#address');
var popup = document.querySelector('.map__card.popup');

//
/**
  * Открытие модального окна
*/

var openPopup = function () {
  popup.style.display = 'block';
  document.addEventListener('keydown', documentKeydownHandler);
};

/**
  * Закрытие модального окна
*/
var closePopup = function () {
  popup.style.display = 'none';
  document.removeEventListener('keydown', documentKeydownHandler);
};

/**
  * Нажатие на кнопки клавиатуры
  * @param {Object} evt - объект события
*/
var documentKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var mainpinMouseupHandler = function () {
  enablePage();
  mainPin.removeEventListener('mouseup', mainpinMouseupHandler);
};


/**
  * Активация страницы
*/
var enablePage = function () {
  mapSection.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  for (var i = 0; i < fieldsetCollection.length; i++) {
    fieldsetCollection[i].disabled = false;
  }

  for (var j = 0; j < pins.length; j++) {
    pins[j].style.display = 'block';
  }

  addDragPin();
  setAddress();
  validateGuests();
};

/**
  * Отключение страницы
*/
var disablePage = function () {
  mapSection.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');

  for (var i = 0; i < fieldsetCollection.length; i++) {
    fieldsetCollection[i].disabled = true;
  }

  for (var j = 0; j < pins.length; j++) {
    pins[j].style.display = 'none';
  }
  setAddress();
  closePopup();
};

/**
  * Установка адреса относительно текущих координат главного пина
*/
var setAddress = function () {
  var left = parseInt(mainPin.style.left, 10);
  var top = parseInt(mainPin.style.top, 10);
  var coordsX = left + Math.round(MAIN_PIN_WIDTH / 2);
  var coordsY = top + MAIN_PIN_HEIGHT + SHARP_END_HEIGHT;
  var address = coordsX + ', ' + coordsY;
  addressInput.value = address;
};

/**
  * Добавление перетаскивания главного пина
*/
var addDragPin = function () {
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var moveCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      if (moveCoords.x <= 0) {
        moveCoords.x = 0;
      }

      if (moveCoords.x > MAX_DRAG_COORDS_X) {
        moveCoords.x = MAX_DRAG_COORDS_X;
      }

      if (moveCoords.y <= 0) {
        moveCoords.y = 0;
      }

      if (moveCoords.y > MAX_DRAG_COORDS_Y) {
        moveCoords.y = MAX_DRAG_COORDS_Y;
      }

      mainPin.style.top = moveCoords.y + 'px';
      mainPin.style.left = moveCoords.x + 'px';
    };

    var mouseUpHandler = function(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      setAddress();
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
};

disablePage();

mainPin.addEventListener('mouseup', mainpinMouseupHandler);

/**
  * Изменение селекта
*/
var selectChangeHandler = function () {
  validateGuests();
};

/**
  * Валидация соответствия количества комнат и гостей
*/
var validateGuests = function () {
  var roomValue = selectRoomNumber.value;
  var capacityValue = selectCapacity.value;
  var capacityArray = GUESTS_VALIDATE_DATA[roomValue];
  selectRoomNumber.setCustomValidity('');
  selectRoomNumber.checkValidity();
  if (capacityArray.indexOf(capacityValue) < 0) {
    selectRoomNumber.setCustomValidity('Количество комнат не подходит для количества гостей');
  }
};

var selectType = document.querySelector('select#type');
var inputPrice = document.querySelector('input#price');

selectType.addEventListener('change', function () {
  var value = selectType.value;
  inputPrice.min = OFFER_DATA[value].minPrice;
  inputPrice.placeholder = OFFER_DATA[value].minPrice;
});

var selectTimeIn = document.querySelector('select#timein');
var selectTimeOut = document.querySelector('select#timeout');

selectTimeIn.addEventListener('change', function () {
  selectTimeOut.value = selectTimeIn.value;
});

selectTimeOut.addEventListener('change', function () {
  selectTimeIn.value = selectTimeOut.value;
});

var selectRoomNumber = document.querySelector('select#room_number');
var selectCapacity = document.querySelector('select#capacity');
selectRoomNumber.addEventListener('change', selectChangeHandler);
selectCapacity.addEventListener('change', selectChangeHandler);
