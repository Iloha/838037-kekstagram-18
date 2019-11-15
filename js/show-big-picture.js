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
  var showenCommentsAmount;
  var currentPicture;

  window.showBigPicture = function (picture) {
    showenCommentsAmount = 0;
    bigPicture.classList.remove('hidden');
    currentPicture = picture;
    fillBigPicture(currentPicture);
  };

  var fillBigPicture = function (picture) {
    bigPictureImg.src = picture.url;
    likesCount.textContent = picture.likes;
    showNextComments();
    // commentsCount.textContent = picture.comments.length;
    socialCaption.textContent = picture.description;
    renderCommentsTemplate(picture.comments);
  };

  var renderCommentsTemplate = function (commentsList) {
    var template = '';
    for (var i = 0; i < showenCommentsAmount; i++) {
      template += '<li class="social__comment"><img class="social__picture" src="' + commentsList[i].avatar + '" alt="' + commentsList[i].name + '" width="35" height="35"><p class="social__text">' + commentsList[i].message + '</p></li>';
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
    showenCommentsAmount += window.data.COMMENTS_NUMBER;
    if (showenCommentsAmount >= currentPicture.comments.length) {
      showenCommentsAmount = currentPicture.comments.length;
      hideLoadMoreComments();
    }
    renderCommentsTemplate(currentPicture.comments);
    commentsCountWrapper.innerHTML = showenCommentsAmount + ' из <span class="comments-count">' + currentPicture.comments.length + '</span> комментариев';
  };
  // var hideComments = function () {
  //   commentsCountWrapper.classList.add('visually-hidden');
  //
  // };

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



  var onClickShowComments = function () {
    showNextComments();
  };
  // hideComments();
  bigPictureCancel.addEventListener('click', onCloseBigPicture);
  document.addEventListener('keydown', onPressEscBigPicture);
  commentsLoader.addEventListener('click', onClickShowComments);

})();

// 1. Показывать 5 комментов
// 2. При нажатии на кнопку показывать следующие 5
// 3. При нажатии на кнопку повесить хэндлер с вызовом фунции showNext5
// 4. showNext5 функция, которая идет по массиву и показывает следующие 5
