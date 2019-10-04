'use strict';

// module4-task2
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
var currentFilter;

var getErrorMessage = function () {
  var tagListData = tagsListInput.value.split(' ');
  var uniqueHashtagsList = [];

  if (tagsListInput.value === '') {
    return '';
  }
  if (tagListData.length > 5) {
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
    if (tag.length > 20) {
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
  setEffectLevel();
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

  switch (currentFilter) {
    case 'none':
      sliderWrap.classList.add('hidden');
      break;
    case 'chrome':
      sliderWrap.classList.remove('hidden');
      value = 'grayscale(' + p + ')';
      break;
    case 'sepia':
      sliderWrap.classList.remove('hidden');
      value = 'sepia(' + p + ')';
      break;
    case 'marvin':
      sliderWrap.classList.remove('hidden');
      value = 'invert(' + p * 100 + '%)';
      break;
    case 'phobos':
      sliderWrap.classList.remove('hidden');
      value = 'blur(' + p * 3 + 'px)';
      break;
    case 'heat':
      sliderWrap.classList.remove('hidden');
      value = 'invert(' + p * 3 + ')';
      break;
  }
  image.style.filter = value;
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


var onMouseDownEffectLevel = function (evt) {
  var startCoords = {
    x: evt.clientX
  };
  console.log('click down')

  var onMouseMoveEffectLevel = function (moveEvt) {
    moveEvt.preventDefault();
    console.log(startCoords, 'move');
    var shift = {
      x: startCoords.x - moveEvt.clientX
    };

    startCoords = {
      x: moveEvt.clientX
    };

    sliderPin.style.left = (sliderPin.offsetLeft - shift.x) + 'px';
  };

  var onMouseUpEffectLevel = function (upEvt) {
    setEffectLevel();
    upEvt.preventDefault();
    console.log('up')
    document.removeEventListener('mousemove', onMouseMoveEffectLevel);
    document.removeEventListener('mouseup', onMouseUpEffectLevel);
  };

  sliderPin.addEventListener('mousemove', onMouseMoveEffectLevel);
  sliderPin.addEventListener('mouseup', onMouseUpEffectLevel);
};

var onEnterPressSubmitForm = function () {
  submitForm();
};

var onChangeEffect = function (evt) {
  var id = evt.target.value;
  setFilter(id);
  setEffectLevel(true);
};

uploadFile.addEventListener('change', onUploadFileChange);

for (var i = 0; i < effectPreviewFields.length; i++) {
  effectPreviewFields[i].addEventListener('change', onChangeEffect);
}
submitFormButton.addEventListener('click', onEnterPressSubmitForm);

sliderPin.addEventListener('mousedown', onMouseDownEffectLevel);

// в котором вычисляются новые координаты, применяться через стили к элементу и записываться в поле уровня эффекта (с поправкой на то, что в это поле записываются координаты середины пина)
// должно меняться значение CSS-фильтра на изображении
