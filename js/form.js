'use strict';


var uploadFile = document.querySelector('#upload-file');
var editFormPopup = document.querySelector('.img-upload__overlay');
var closeEditFormPopup = editFormPopup.querySelector('#upload-cancel');

var sliderPin = editFormPopup.querySelector('.effect-level__pin');
var slider = editFormPopup.querySelector('.effect-level__line');
var sliderWrap = editFormPopup.querySelector('.img-upload__effect-level');
var image = editFormPopup.querySelector('.img-upload__preview img');
var effectPreviewFields = editFormPopup.querySelectorAll('input[name="effect"]');

var editForm = document.querySelector('.img-upload__form');
var tagsListInput = editFormPopup.querySelector('input[name="hashtags"]');
var submitFormButton = editFormPopup.querySelector('.img-upload__submit');
var effectDepth = editForm.querySelector('.effect-level__depth');
var currentFilter;
var HASHTAG_MAX_LENGTH = 20;
var HASHTAGS_MAX_AMOUNT = 5;
var COORDINATES = {
  MIN: 0,
  MAX: 453
};

var getErrorMessage = function () {
  var tagListData = tagsListInput.value.split(' ');
  var uniqueHashtagsList = [];

  if (tagsListInput.value === '') {
    return '';
  }
  if (tagListData.length > HASHTAGS_MAX_AMOUNT) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }
  for (var i = 0; i < tagListData.length; i++) {
    var tag = tagListData[i].toLowerCase();
    if (tag.charAt(0) !== '#' ) {
      return 'Хеш-тег должен начинаться с #';
    }
    if (tag.slice(1).includes('#')) {
      return 'Хэш-теги должны разделяться пробелами';
    }
    if (tag.length === 1) {
      return 'Хеш-тег не может состоять только из #';
    }
    if (tag.length > HASHTAG_MAX_LENGTH) {
      return 'Максимальная длина хэш-тега должна быть 20 символов';
    }
    if (!uniqueHashtagsList.includes(tag)) {
      uniqueHashtagsList.push(tag);
    }
  }
  if (uniqueHashtagsList.length !== tagListData.length) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }
};

var showEditFormPopup = function () {
  editFormPopup.classList.remove('hidden');
  sliderWrap.classList.add('hidden');
  closeEditFormPopup.addEventListener('click', onCloseForm);
  document.addEventListener('keydown', onPressEscClose);
};

var closeForm = function () {
  editFormPopup.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('click', onCloseForm);
  document.removeEventListener('keydown', onPressEscClose);
};

var submitForm = function () {
  var message = getErrorMessage();

  if (message) {
    tagsListInput.setCustomValidity(message);
    return;
  }

  editForm.submit();
};

var setFilter = function (id) {
  image.className = 'effects__preview--' + id;
  currentFilter = id;
};

var setEffectLevel = function (max) {
  var p;
  if (max) {
    p = 1;
  } else {
    p = sliderPin.offsetLeft / slider.offsetWidth;
  }
  var value = '';
  sliderWrap.classList.add('hidden');
  if (currentFilter !== 'none') {
    sliderWrap.classList.remove('hidden');
  }
  switch (currentFilter) {
    case 'chrome':
      value = 'grayscale(' + p + ')';
      break;
    case 'sepia':
      value = 'sepia(' + p + ')';
      break;
    case 'marvin':
      value = 'invert(' + p * 100 + '%)';
      break;
    case 'phobos':
      value = 'blur(' + p * 3 + 'px)';
      break;
    case 'heat':
      value = 'invert(' + p * 3 + ')';
      break;
  }
  image.style.filter = value;

  var setEffectDepth = function () {
    effectDepth.style.width = (p * 100) + '%';
  };
  setEffectDepth();
  if (max) {
    setPinPosition(COORDINATES.MAX);
  }
};

var onUploadFileChange = function () {
  showEditFormPopup();
};

var onCloseForm = function () {
  closeForm();
};

var commentsField = editForm.querySelector('.text__description');

var ableToEsc = function (evt) {
  if (evt.target === tagsListInput || evt.target === commentsField) {
    return false;
  }

  return true;
};

var onPressEscClose = function (evt) {
  if (evt.keyCode === window.data.ESC_CODE && ableToEsc(evt)) {
    closeForm();
  }
};

var setPinPosition = function (newValue) {
  if ((newValue >= COORDINATES.MIN) && (newValue <= COORDINATES.MAX)) {
    sliderPin.style.left = newValue + 'px';
  }
};

var onMouseDownEffectLevel = function (evt) {
  var startX = evt.clientX;

  var onMouseMoveEffectLevel = function (moveEvt) {
    moveEvt.preventDefault();
    var shift = startX - moveEvt.clientX;
    startX = moveEvt.clientX;
    var newValue = sliderPin.offsetLeft - shift;
    setPinPosition(newValue);
    setEffectLevel();
  };

  var onMouseUpEffectLevel = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMoveEffectLevel);
    document.removeEventListener('mouseup', onMouseUpEffectLevel);
  };

  document.addEventListener('mousemove', onMouseMoveEffectLevel);
  document.addEventListener('mouseup', onMouseUpEffectLevel);
};

var onEnterPressSubmitForm = function () {
  submitForm();
};

var onChangeEffect = function (evt) {
  var id = evt.target.value;
  setFilter(id);
  setEffectLevel(true);
};

editForm.addEventListener('submit', function (evt) {
  window.upload(new FormData(editForm), function (response) {
    editFormPopup.classList.add('hidden');
  });
  evt.preventDefault();
});

uploadFile.addEventListener('change', onUploadFileChange);

for (var i = 0; i < effectPreviewFields.length; i++) {
  effectPreviewFields[i].addEventListener('change', onChangeEffect);
}
submitFormButton.addEventListener('click', onEnterPressSubmitForm);
sliderPin.addEventListener('mousedown', onMouseDownEffectLevel);
