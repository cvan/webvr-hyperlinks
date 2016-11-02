/* global decky, hljs */
(function () {
  var els = document.querySelectorAll('code[data-src]');
  Array.from(els).forEach(function (el) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      el.innerHTML = this.responseText.replace('<', '&lt;', 'g');
      hljs.highlightBlock(el);
    });
    xhr.open('get', el.getAttribute('data-src'));
    xhr.send();
  });

  var iframes = document.querySelectorAll('iframe');
  iframes = Array.from(iframes);
  iframes.forEach(function (i) {
    var src = i.src;
    i.setAttribute('data-src', src);
    i.src = '';
  });

  var talkProgress = document.querySelector('.talk-progress');
  var timeProgress = document.querySelector('.time-progress');
  var sTime;
  var timer;
  var going = false;

  decky.onSlideChange = function (n) {
    if (n > 1 && !going) {
      going = true;
      timer = setInterval(updateProgress, 100);
      sTime = Date.now();
      console.log('starting timer');
    }
    var pct = n / decky.num * 100;
    talkProgress.style.transform = 'translate(' + pct + '%, 0)';

    iframes.forEach(function (i) {
      i.src = '';
    });

    var f = document.querySelector('.active iframe');
    if (f && window.top === window) {
      f.src = f.getAttribute('data-src');
    }
  };

  var updateProgress = function () {
    var time = Math.min(100, ((Date.now() - sTime) / (40 * 60 * 1000)) * 100);
    timeProgress.style.transform = 'translate(' + time + '%, 0)';
  };

  // Video playback.

  var videoPlayback = function (video) {
    if (!video) {
      return;
    }

    var seeked = false;
    var paused = false;

    video.addEventListener('canplaythrough', function () {
      if (!seeked) {
        video.currentTime = 2 * 60 + 59;
      }
      seeked = true;
    });

    video.addEventListener('timeupdate', function () {
      if (!paused && video.currentTime > 5 * 60 + 17.5) {
        video.pause();
        paused = true;
      }
    });

    return video;
  };

  videoPlayback(document.querySelector('#video-demo'));

  hljs.initHighlightingOnLoad();
})();
