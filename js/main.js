var COMMENTS_NUMBER = 2;
var IMAGES_NUMBER = 25;
var AVATAR_MAX = 6;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var ESC_CODE = 27;

var imagesTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var imagesList = document.querySelector('.pictures');

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

  for (var i = 0; i < COMMENTS_NUMBER; i++) {
    commentsArray.push({
      avatar: 'img/avatar-' + getRandomArbitrary(1, AVATAR_MAX) + '.svg',
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
      url: 'photos/' + getRandomArbitrary(1, j) + '.jpg',
      description: '',
      likes: getRandomArbitrary(LIKES_MIN, LIKES_MAX),
      comments: generateComments()
    });
  }

  return dataArray;
}

var renderImage = function (image) {
  var ImageElement = imagesTemplate.cloneNode(true);

  ImageElement.querySelector('.picture__img').setAttribute('src', image.url);
  ImageElement.querySelector('.picture__likes').textContent = image.likes;
  ImageElement.querySelector('.picture__comments').textContent = image.comments.length;

  return ImageElement;
};

var renderImagesList = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderImage(array[i]));
  }

  return fragment;
}

var imagesArray = generateArray(IMAGES_NUMBER);
var fragment = renderImagesList(imagesArray);
imagesList.appendChild(fragment);


var uploadFile = document.querySelector('#upload-file');
var editForm = document.querySelector('.img-upload__overlay');
var closeEditForm = editForm.querySelector('#upload-cancel')

var showEditForm = function () {
  editForm.classList.remove('hidden');
  closeEditForm.addEventListener('click', onCloseForm);
  document.addEventListener('keydown', onPressEscClose);
};

var closeForm = function () {
  editForm.classList.add('hidden');
  document.removeEventListener('change', onUploadFileChange);
  document.removeEventListener('click', onCloseForm);
  document.removeEventListener('keydown', onPressEscClose);
}

var onUploadFileChange = function () {
  showEditForm();
}

var onCloseForm = function () {
  closeForm();

  //remove all handlers
}

var onPressEscClose = function(evt) {
  if (evt.keyCode === ESC_CODE) {
    closeForm();
  }
}

uploadFile.addEventListener('change', onUploadFileChange);


// На клик по крестику вешаю обработчик на закрывтие формы, и esc
//который вызывает функцию closeForm, в которой также сбрасывается значение поля выбора файла #upload-file
