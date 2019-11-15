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
var effectDepth = editForm.querySelector('.effect-level__depth');
var commentsField = editForm.querySelector('.text__description');
var effectLevelField = editForm.querySelector('.effect-level__value');

var mainSection = document.querySelector('main');
var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

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
  var message = '';
  if (tagsListInput.value === '') {
    return message;
  }
  if (tagListData.length > HASHTAGS_MAX_AMOUNT) {
    message = 'Нельзя указать больше пяти хэш-тегов';
    return message;
  }
  for (var i = 0; i < tagListData.length; i++) {
    var tag = tagListData[i].toLowerCase();
    if (tag.charAt(0) !== '#') {
      message = 'Хеш-тег должен начинаться с #';
      return message;
    }
    if (tag.slice(1).includes('#')) {
      message = 'Хэш-теги должны разделяться пробелами';
      return message;
    }
    if (tag.length === 1) {
      message = 'Хеш-тег не может состоять только из #';
      return message;
    }
    if (tag.length > HASHTAG_MAX_LENGTH) {
      message = 'Максимальная длина хэш-тега должна быть 20 символов';
      return message;
    }
    if (!uniqueHashtagsList.includes(tag)) {
      uniqueHashtagsList.push(tag);
    }
  }
  if (uniqueHashtagsList.length !== tagListData.length) {
    message = 'Один и тот же хэш-тег не может быть использован дважды';
    return message;
  }
  return message;
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
  var setEffectValue = function () {
    effectLevelField.setAttribute('value', p * 100);
  };
  setEffectDepth();
  setEffectValue();
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

var onChangeEffect = function (evt) {
  var id = evt.target.value;
  setFilter(id);
  setEffectLevel(true);
};

var resetForm = function () {
  commentsField.value = '';
  tagsListInput.value = '';
  setFilter('none');
  setEffectLevel(true);
  effectPreviewFields[0].checked = true;
};

var onSubmit = function (evt) {
  evt.preventDefault();
  if (!evt.target.checkValidity()) {
    return;
  }

  var formDataTest = new FormData(editForm);

  var errorHandler = function (errorMessage) {
    var errorBlock = errorTemplate.cloneNode(true);
    editFormPopup.classList.add('hidden');
    errorBlock.querySelector('.error__title').textContent = errorMessage;
    mainSection.insertAdjacentElement('afterbegin', errorBlock);

    var closeErrorBlock = function () {
      errorBlock.style.display = 'none';
      errorButton.removeEventListener('click', onCloseErrorBlock);
      document.removeEventListener('keydown', onEscCloseErrorBlock);
      document.removeEventListener('click', onCloseAnyClickErrorBlock);
    };

    var errorButton = document.querySelector('.error__button');

    var onCloseErrorBlock = function () {
      closeErrorBlock();
    };

    var onEscCloseErrorBlock = function (evtT) {
      if (evtT.keyCode === window.data.ESC_CODE) {
        closeErrorBlock();
      }
    };

    var onCloseAnyClickErrorBlock = function (evtT) {
      if (evtT.target === errorBlock) {
        closeErrorBlock();
      }
    };

    errorButton.addEventListener('click', onCloseErrorBlock);
    document.addEventListener('keydown', onEscCloseErrorBlock);
    document.addEventListener('click', onCloseAnyClickErrorBlock);
  };

  var successHandler = function () {
    var successBlock = successTemplate.cloneNode(true);

    editFormPopup.classList.add('hidden');
    resetForm();
    mainSection.insertAdjacentElement('afterbegin', successBlock);

    var closeSuccessBlock = function () {
      successBlock.style.display = 'none';
      successButton.removeEventListener('click', onCloseSuccessBlock);
      document.removeEventListener('keydown', onEscCloseSuccessBlock);
      document.removeEventListener('click', onCloseAnyClickSuccessBlock);
    };

    var successButton = document.querySelector('.success__button');

    var onCloseSuccessBlock = function () {
      closeSuccessBlock();
    };

    var onEscCloseSuccessBlock = function (evtT) {
      if (evtT.keyCode === window.data.ESC_CODE) {
        closeSuccessBlock();
      }
    };

    var onCloseAnyClickSuccessBlock = function (evtT) {
      if (evtT.target === successBlock) {
        closeSuccessBlock();
      }
    };

    successButton.addEventListener('click', onCloseSuccessBlock);
    document.addEventListener('keydown', onEscCloseSuccessBlock);
    document.addEventListener('click', onCloseAnyClickSuccessBlock);
  };

  window.upload(formDataTest, successHandler, errorHandler);
};

editForm.addEventListener('submit', onSubmit);
tagsListInput.addEventListener('change', function () {
  var message = getErrorMessage();
  tagsListInput.setCustomValidity(message);
});
uploadFile.addEventListener('change', onUploadFileChange);

for (var i = 0; i < effectPreviewFields.length; i++) {
  effectPreviewFields[i].addEventListener('change', onChangeEffect);
}
sliderPin.addEventListener('mousedown', onMouseDownEffectLevel);
