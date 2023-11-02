let IS_MOBILE = false;
(() => {
  const viewport_min_width = 360;
  /* 2023-01-11 :: START ::  모바일 기기인지 체크 */
  const mobileArr = new Array(
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'Android',
    'Windows CE',
    'LG',
    'MOT',
    'SAMSUNG',
    'SonyEricsson',
  );

  for (const txt in mobileArr) {
    if (navigator.userAgent.indexOf(mobileArr[txt]) > -1) {
      IS_MOBILE = true;
      break;
    }
  }
  //2019-10-20 시점, iPAD userAgent로 모바일 체크가 불가능해져 아래 소스 추가
  //https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    IS_MOBILE = true;
  }

  const el_html = document.querySelector('html');
  el_html.setAttribute('data-is-mobile', IS_MOBILE);
  /* // 2023-01-11 :: END :: 모바일 기기인지 체크 */

  /*
  https://m.naver.com/
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
  https://m.daum.net/
  <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width">
  */
  const el_viewport = document.querySelector('meta[name="viewport"]');
  window.addEventListener('resize', (evt) => {
    setViewPort();
  });
  setViewPort();

  function setViewPort() {
    if (!IS_MOBILE) return;
    const v_wid = window.outerWidth;
    if (v_wid <= viewport_min_width) {
      el_viewport.setAttribute('content', `width=${viewport_min_width},user-scalable=no`);
    } else {
      el_viewport.setAttribute(
        'content',
        'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no',
      );
    }
  }
})();
