'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var likesCount = bigPicture.querySelector('.likes-count');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var commentsWrapper = bigPicture.querySelector('.social__comments');
  var commentsCountWrapper = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var addCommentField = bigPicture.querySelector('.social__footer-text');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var shownCommentsAmount;
  var currentPicture;

  window.showBigPicture = function (picture) {
    shownCommentsAmount = 0;
    bigPicture.classList.remove('hidden');
    currentPicture = picture;
    fillBigPicture(currentPicture);
  };

  var fillBigPicture = function (picture) {
    bigPictureImg.src = picture.url;
    likesCount.textContent = picture.likes;
    showNextComments();
    socialCaption.textContent = picture.description;
    renderCommentsTemplate(picture.comments);
  };

  var renderCommentsTemplate = function (comments) {
    var template = '';
    for (var i = 0; i < shownCommentsAmount; i++) {
      template += '<li class="social__comment"><img class="social__picture" src="' + comments[i].avatar + '" alt="' + comments[i].name + '" width="35" height="35"><p class="social__text">' + comments[i].message + '</p></li>';
    }
    commentsWrapper.innerHTML = template;
  };

  var hideLoadMoreComments = function () {
    commentsLoader.classList.add('visually-hidden');
  };

  var showLoadMoreComments = function () {
    commentsLoader.classList.remove('visually-hidden');
  };

  var showNextComments = function () {
    showLoadMoreComments();
    shownCommentsAmount += window.data.COMMENTS_NUMBER;
    if (shownCommentsAmount >= currentPicture.comments.length) {
      shownCommentsAmount = currentPicture.comments.length;
      hideLoadMoreComments();
    }
    renderCommentsTemplate(currentPicture.comments);
    commentsCountWrapper.innerHTML = shownCommentsAmount + ' из <span class="comments-count">' + currentPicture.comments.length + '</span> комментариев';
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('click', onCloseBigPicture);
    document.removeEventListener('click', onPressEscBigPicture);
    document.removeEventListener('click', onClickShowComments);
  };

  var onCloseBigPicture = function () {
    closeBigPicture();
  };

  var onPressEscBigPicture = function (evt) {
    if (evt.keyCode === window.data.ESC_CODE && evt.target !== addCommentField) {
      closeBigPicture();
    }
  };

  var onClickShowComments = function () {
    showNextComments();
  };

  // TODO: wrap to init function and call from showBigpicture
  bigPictureCancel.addEventListener('click', onCloseBigPicture);
  document.addEventListener('keydown', onPressEscBigPicture);
  commentsLoader.addEventListener('click', onClickShowComments);
})();
