'use strict';
(function () {
  var ESC_KEYCODE = 27;

  var popupTemplate = document.querySelector('template').content.querySelector('.map__card');
  var popupNode = popupTemplate.cloneNode(true);

  popupNode.querySelector('.popup__close').addEventListener('click', function (evt) {
    evt.preventDefault();
    window.popup.close();
  });

  document.querySelector('.map').insertBefore(popupNode, document.querySelector('.map__filters-container'));

  var popupPhotos = popupNode.querySelector('.popup__photos');
  var popupImage = popupTemplate.querySelector('.popup__photo');
  var popupFeatures = popupNode.querySelector('.popup__features');
  var popupFeature = popupNode.querySelector('.popup__feature');

  /**
    * Нажатие на кнопки клавиатуры
    * @param {Object} evt - объект события
  */
  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.popup.close();
    }
  };

  window.popup = {
    /**
      * Открытие модального окна
    */
    open: function () {
      popupNode.style.display = 'block';
      document.addEventListener('keydown', documentKeydownHandler);
    },

    /**
      * Закрытие модального окна
    */
    close: function () {
      popupNode.style.display = 'none';
      document.removeEventListener('keydown', documentKeydownHandler);
    },

    /**
      * Изменение содержимого карточки-popup
      * @param {Object} dataObject - объект данных
      * @return {Object} - измененная карточка
    */
    fill: function (dataObject) {
      popupNode.querySelector('.popup__title').textContent = dataObject.offer.title;
      popupNode.querySelector('.popup__text--address').textContent = dataObject.offer.address;
      popupNode.querySelector('.popup__text--price').textContent = dataObject.offer.price + '₽/ночь';
      popupNode.querySelector('.popup__type').textContent = window.form.offerData[dataObject.offer.type].translate;
      popupNode.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms + ' комнаты для ' + dataObject.offer.guests + ' гостей';
      popupNode.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObject.offer.checkin + ', выезд до ' + dataObject.offer.checkout;
      popupNode.querySelector('.popup__description').textContent = dataObject.offer.description;
      popupFeatures.textContent = '';
      popupPhotos.textContent = '';

      var photosArray = dataObject.offer.photos;
      if ( photosArray.length ) {
        for (var i = 0; i < photosArray.length; i++) {
          var newImg = popupImage.cloneNode(true);
          newImg.src = photosArray[i];
          popupPhotos.appendChild(newImg);
        }
      }

      var featuresArray = dataObject.offer.features;
      if ( featuresArray.length ) {
        console.log(featuresArray.length);
        for (var j = 0; j < dataObject.offer.features.length; j++) {
          var newFeature = popupFeature.cloneNode(true);
          newFeature.classList = '';
          newFeature.classList.add('popup__feature', 'popup__feature--' + dataObject.offer.features[j]);
          popupFeatures.appendChild(newFeature);
        }
      }

      popupNode.querySelector('.popup__avatar').src = dataObject.author.avatar;

      return popupNode;
    }
  };
})();
