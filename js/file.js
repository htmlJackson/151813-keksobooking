'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  /**
    * Загрузка изображения
    * @param {Object} chooser - инпут загрузки
    * @param {Object} preview - место для показа
  */
  var uploadImage = function (chooser, preview) {
    var file = chooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  avatarChooser.addEventListener('change', function () {
    uploadImage(avatarChooser, avatarPreview);
  });

  var photosChooser = document.querySelector('#images');
  var photosContainer = document.querySelector('.ad-form__photo-container');
  var photoTemplate = document.querySelector('.ad-form__photo');

  photosContainer.removeChild(photoTemplate);

  photosChooser.addEventListener('change', function () {
    var img = document.createElement('img');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';

    var photo = photoTemplate.cloneNode(true);

    uploadImage(photosChooser, img);
    photo.appendChild(img);

    photosContainer.appendChild(photo);
  });


  window.file = {
    clean: function () {
      avatarPreview.src = DEFAULT_AVATAR_SRC;
      Array.from(document.querySelectorAll('.ad-form__photo')).forEach(function (it) {
        it.remove();
      });
    }
  };

})();
