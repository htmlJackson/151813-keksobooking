(function () {
  window.util = {
    /**
      * Генерация случайного числа в заданном диапазоне
      * @param {number} min - начало диапазона
      * @param {number} max - конец диапазона
      * @return {number} - случайное число
    */
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
      * Получение случайного элемента массива
      * @param {Array} array - массив
      * @return {string} - элемент массива
    */
    getRandomArrayElement: function (array) {
      var number = this.getRandomInt(0, array.length);
      return array[number];
    },

    /**
      * Перемешивание элементов массива
      * @param {Array} array - исходный массив
      * @return {Array} - массив с перемешанными элементами
    */
    shuffleArray: function (array) {
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
    },

    /**
      * Получение случайных элементов массива
      * @param {Array} array - исходный массив
      * @return {Array} - массив случайных элементов
    */
    getRandomElems: function (array) {
      var randomArray = this.shuffleArray(array);
      var count = this.getRandomInt(0, randomArray.length);
      var resultArray = [];

      for (var i = 0; i <= count; i++) {
        resultArray.push(randomArray[i]);
      }
      return resultArray;
    }
  }
})();
