'use strict';
var generateAds = function (count) {

  var adArray = [];

  var titleData = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var typeData = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var timeData = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var featuresData = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getPhotos = function () {
    var photosData = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ];

    var currentIndex = photosData.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = photosData[currentIndex];
      photosData[currentIndex] = photosData[randomIndex];
      photosData[randomIndex] = temporaryValue;
    }

    return photosData;
  };

  var getAvatarSrc = function (number) {
    var avatarNumber = '0' + number;
    var avatarSrc = 'img/avatars/user' + avatarNumber + '.png';
    return avatarSrc;
  };

  var getRandomData = function (data) {
    var dataRandom = getRandomInt(0, data.length);
    return data[dataRandom];
  };

  var getFeatures = function () {
    var featuresArray = [];
    var featuresCount = getRandomInt(0, featuresData.length);
    for (var i = 0; i <= featuresCount; i++) {
      featuresArray.push(featuresData[i]);
    }
    return featuresArray;
  };

  var createAd = function (currentNumber) {
    var ad = {};
    ad.author = {
      avatar: getAvatarSrc(currentNumber)
    };
    ad.location = {
      x: getRandomInt(300, 900),
      y: getRandomInt(150, 500)
    };
    ad.offer = {
      title: titleData[currentNumber - 1],
      adress: ad.location.x + ', ' + ad.location.y,
      price: getRandomInt(1000, 1000000),
      type: getRandomData(typeData),
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 5),
      checkin: getRandomData(timeData),
      checkout: getRandomData(timeData),
      features: getFeatures(),
      description: '',
      photos: getPhotos()
    };

    return ad;
  };

  for (var i = 1; i <= count; i++) {
    adArray.push(createAd(i));
  }

  return adArray;
};

document.querySelector('.map').classList.remove('map--faded');

var pinsList = document.querySelector('.map__pins');

var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var popupTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderPins = function (elem) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.style.left = elem.location.x + (pinElement.clientWidth / 2) + 'px';
  pinElement.style.top = elem.location.y - pinElement.clientHeight + 'px';

  pinImage.src = elem.author.avatar;
  pinImage.alt = elem.offer.title;

  return pinElement;
};

var renderPopup = function (elem) {
  var popupElement = popupTemplate.cloneNode(true);
  var popupPhotos = popupElement.querySelector('.popup__photos');
  var popupImage = popupElement.querySelector('.popup__photo');

  var offerType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  popupElement.querySelector('.popup__title').textContent = elem.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = elem.offer.address;
  popupElement.querySelector('.popup__text--price').textContent = elem.offer.price + '₽/ночь';
  popupElement.querySelector('.popup__type').textContent = offerType[elem.offer.type];
  popupElement.querySelector('.popup__text--capacity').textContent = elem.offer.rooms + ' комнаты для ' + elem.offer.guests + ' гостей';
  popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + elem.offer.checkin + ', выезд до ' + elem.offer.checkout;
  popupElement.querySelector('.popup__features').textContent = elem.offer.features;
  popupElement.querySelector('.popup__description').textContent = elem.offer.description;
  popupPhotos.textContent = '';

  for (var i = 0; i < elem.offer.photos.length; i++) {
    var newImg = popupImage.cloneNode(true);
    newImg.src = elem.offer.photos[i];
    popupPhotos.appendChild(newImg);
  }

  popupElement.querySelector('.popup__avatar').src = elem.author.avatar;
  return popupElement;
};

var pinsFragment = document.createDocumentFragment();
var cardFragment = document.createDocumentFragment();

var ADS_COUNT = 8;

var ads = generateAds(ADS_COUNT);

for (var j = 0; j < ads.length; j++) {
  pinsFragment.appendChild(renderPins(ads[j]));
}

cardFragment.appendChild(renderPopup(ads[0]));

pinsList.appendChild(pinsFragment);
document.querySelector('.map').insertBefore(cardFragment, document.querySelector('.map__filters-container'));
