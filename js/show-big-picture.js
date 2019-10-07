'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var likesCount = bigPicture.querySelector('.likes-count');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var commentsWrapper = bigPicture.querySelector('.social__comments');
  var commentsCountWrapper = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var addCommentField = bigPicture.querySelector('.social__footer-text');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  window.showBigPicture = function (picture) {
    bigPicture.classList.remove('hidden');
    fillBigPicture(picture);
  };

  var fillBigPicture = function (picture) {
    bigPictureImg.src = picture.url;
    likesCount.textContent = picture.likes;
    commentsCount.textContent = picture.comments.length;
    socialCaption.textContent = picture.description;
    renderCommentsTemplate(picture.comments);
  };

  var renderCommentsTemplate = function (commentsList) {
    var template = '';
    for (var i = 0; i < 5; i++) {
      template += '<li class="social__comment"><img class="social__picture" src="' + commentsList[i].avatar + '" alt="' + commentsList[i].name  + '" width="35" height="35"><p class="social__text">' + commentsList[i].message + '</p></li>'
    }
    commentsWrapper.innerHTML = template;
  };

  var hideComments = function () {
    commentsCountWrapper.classList.add('visually-hidden');
    commentsLoader.classList.add('visually-hidden');
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('click', onCloseBigPicture);
  };

  var onCloseBigPicture = function () {
    closeBigPicture();
  };

  var onPressEscBigPicture = function (evt) {
    if (evt.keyCode === window.data.ESC_CODE && evt.target !== addCommentField) {
      closeBigPicture();
    }
  };

  hideComments();
  bigPictureCancel.addEventListener('click', onCloseBigPicture);
  document.addEventListener('keydown', onPressEscBigPicture);

})();
