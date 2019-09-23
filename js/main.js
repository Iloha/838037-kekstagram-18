var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var namesArray = [
  'Антон',
  'Константин',
  'Роман',
  'Слава',
  'Данил',
  'Андрей',
  'Максим'
];
var getRandomFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomArbitrary = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var generateComments = function () {
  var commentsArray = [];
  for (var i = 0; i < 2; i++) {
    commentsArray.push({
      avatar: 'img/avatar-' + getRandomArbitrary(1, 6) + '.svg',
      message: getRandomFromArray(comments),
      name: getRandomFromArray(namesArray)
    })
  }
  return commentsArray;
};


var generateArray = function (j) {
  var dataArray = [];
  for (var i = 0; i < j; i++) {
    dataArray.push({
      url: 'photos/' + getRandomArbitrary(1, 25) + '.jpg',
      description: '',
      likes: getRandomArbitrary(15, 200),
      comments: generateComments()
    });
  }
  return dataArray;
}

var imagesArray = generateArray(25);
