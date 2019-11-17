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
    var visibleComments = comments.slice(0, shownCommentsAmount);
    var commentsFragment = document.createDocumentFragment();

    visibleComments.forEach(function (comment) {
      var commentElement = document.createElement('li');
      commentElement.classList.add('social__comment');

      var pictureElement = document.createElement('img');
      pictureElement.classList.add('social__picture');
      pictureElement.setAttribute('src', comment.avatar);
      pictureElement.setAttribute('alt', comment.name);
      pictureElement.setAttribute('width', '35');
      pictureElement.setAttribute('height', '35');

      var textElement = document.createElement('p');
      textElement.classList.add('social__text');
      textElement.textContent = comment.message;

      commentElement.appendChild(pictureElement);
      commentElement.appendChild(textElement);
      commentsFragment.appendChild(commentElement);
    });
    commentsWrapper.innerHTML = '';
    commentsWrapper.appendChild(commentsFragment);
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

  bigPictureCancel.addEventListener('click', onCloseBigPicture);
  document.addEventListener('keydown', onPressEscBigPicture);
  commentsLoader.addEventListener('click', onClickShowComments);
})();
