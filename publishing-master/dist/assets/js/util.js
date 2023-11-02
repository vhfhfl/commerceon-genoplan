const Util = {};

/**
 * uid 반환
 * @returns {string}
 */
Util.getUid = () => {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};

/**
 * 오늘날짜 문자열반환
 */
Util.getToday = (betweenStr) => {
  if (typeof betweenStr === 'undefined') betweenStr = '';
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  today = yyyy + betweenStr + mm + betweenStr + dd;
  return today;
};

/**
 * 입력되는 컬러와 대비되어 잘 보이는 색상 반환
 * @param color_hex
 * @returns {string}
 * ex)
 * Util.getGoodColor('#ff0000');
 */
Util.getGoodColor = (color_hex) => {
  const c = color_hex.substring(1); // 색상 앞의 # 제거
  const rgb = parseInt(c, 16); // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff; // red 추출
  const g = (rgb >> 8) & 0xff; // green 추출
  const b = (rgb >> 0) & 0xff; // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // 색상 선택
  return luma < 127.5 ? 'white' : 'black';
};

/**
 * URL 에서 파라메터 추출
 * @param key
 * @returns {string}
 */
Util.getParam = (key) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const result = urlParams.get(key);
  return result;
};
