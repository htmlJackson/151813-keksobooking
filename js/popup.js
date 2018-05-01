'use strict';
(function () {
  var ESC_KEYCODE = 27;
  /**
    * Нажатие на кнопки клавиатуры
    * @param {Object} evt - объект события
  */
  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.popup.close();
    }
  };

  /**
    * Генерация DOM-элемента карточки-popup
    * @return {Object} - элемент для вставки на страницу
  */
  var renderPopup = function () {
    var popupTemplate = document.querySelector('template').content.querySelector('.map__card');
    var popupNode = popupTemplate.cloneNode(true);
    var popupCloser = popupNode.querySelector('.popup__close');
    popupCloser.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.popup.close();
    });
    return popupNode;
  };

  var card = renderPopup();
  document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));

  window.popup = {
    /**
      * Открытие модального окна
    */
    open: function () {
      card.style.display = 'block';
      document.addEventListener('keydown', documentKeydownHandler);
    },

    /**
      * Закрытие модального окна
    */
    close: function () {
      card.style.display = 'none';
      document.removeEventListener('keydown', documentKeydownHandler);
    },

    /**
      * Изменение содержимого карточки-popup
      * @param {Object} dataObject - объект данных
      * @return {Object} - измененная карточка
    */
    fill: function (dataObject) {
      var popupPhotos = card.querySelector('.popup__photos');
      var popupImage = card.querySelector('.popup__photo');
      var popupFeatures = card.querySelector('.popup__features');
      var popupFeature = card.querySelector('.popup__feature');
      card.querySelector('.popup__title').textContent = dataObject.offer.title;
      card.querySelector('.popup__text--address').textContent = dataObject.offer.address;
      card.querySelector('.popup__text--price').textContent = dataObject.offer.price + '₽/ночь';
      card.querySelector('.popup__type').textContent = form.offerData[dataObject.offer.type].translate;
      card.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms + ' комнаты для ' + dataObject.offer.guests + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObject.offer.checkin + ', выезд до ' + dataObject.offer.checkout;
      card.querySelector('.popup__description').textContent = dataObject.offer.description;
      popupFeatures.textContent = '';
      popupPhotos.textContent = '';

      var photosArray = util.shuffleArray(dataObject.offer.photos);

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

      card.querySelector('.popup__avatar').src = dataObject.author.avatar;

      return card;
    }
  };
})();
