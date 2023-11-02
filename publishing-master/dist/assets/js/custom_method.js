/* 2023-09-13 :: START :: window */
(() => {
  // URL 객체 생성
  const urlObj = new URL(window.location.href);

  // URLSearchParams 객체 생성
  const params = new URLSearchParams(urlObj.search);

  // 파라메터 정보를 배열로 변환 후, Object.fromEntries를 이용해 객체로 변환
  const paramsObject = Object.fromEntries(params.entries());
  window.params = paramsObject;
  const c_label = 'window.params';
  const c_label_style = 'border:1px solid black; background:skyblue; color:#333; padding:0.25em 0.5em; font-size:12px; font-weight:bold;';
  const c_value = JSON.stringify(window.params);
  const c_value_style = 'border:1px solid black; background:#ffffd4; color:#333; padding:0.25em 0.5em; font-size:12px; border-left:none;';
  console.log(`%c${c_label}%c${c_value}`, c_label_style, c_value_style);
})();

/**
 * 짧은 uid 반환
 * @returns {string}
 */
window.UID = () => {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};
/* // 2023-09-13 :: END :: window */

/* 2023-09-13 :: START :: Date */
Date.prototype.getToday = (between_str = '') => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  today = yyyy + between_str + mm + between_str + dd;
  return today;
};
/* // 2023-09-13 :: END :: Date */

/* 2023-09-13 :: START :: HTMLElement */
const ori_proto_method_list = Object.getOwnPropertyNames(HTMLElement.prototype);

/**
 * 클래스 추가
 * @param className
 * ex)
 * el_target.addClass('Focus');
 */
HTMLElement.prototype.addClass = function (classNames) {
  var classes = classNames.split(' ');
  for (var i = 0; i < classes.length; i++) {
    this.classList.add(classes[i]);
  }
  return this;
};

/**
 * 클래스 제거
 * @param className
 */
HTMLElement.prototype.removeClass = function (classNames) {
  var classes = classNames.split(' ');
  for (var i = 0; i < classes.length; i++) {
    this.classList.remove(classes[i]);
  }
  return this;
};

/**
 * 클래스 소유 여부 반환
 * @param className
 * @returns {boolean}
 */
HTMLElement.prototype.hasClass = function (className) {
  return this.classList.contains(className);
};

/**
 * 형제 요소 반환
 * @param selector
 * @returns {*[]}
 */
HTMLElement.prototype.siblings = function (selector) {
  var siblings = [];
  var currentNode = this.parentNode.firstChild;

  while (currentNode) {
    if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode !== this) {
      if (!selector || currentNode.matches(selector)) {
        siblings.push(currentNode);
      }
    }

    currentNode = currentNode.nextSibling;
  }

  return siblings;
};

/**
 *
 */
HTMLElement.prototype.hide = function () {
  this.style.display = 'none';
};

/**
 *
 */
HTMLElement.prototype.show = function () {
  this.style.display = '';
};

/**
 *
 * @param attributeName
 * @param value
 * @returns {HTMLElement|string}
 */
HTMLElement.prototype.attr = function (attributeName, value) {
  if (value === undefined) {
    // getter
    return this.getAttribute(attributeName);
  } else {
    // setter
    this.setAttribute(attributeName, value);
    return this;
  }
};

/**
 *
 * @param propertyName
 * @param value
 * @returns {HTMLElement|*}
 */
HTMLElement.prototype.css = function (propertyName, value) {
  if (value === undefined) {
    if (typeof propertyName === 'string') {
      // 일치하는 요소 집합 중 첫 번째 요소의 스타일 속성 값 가져오기.
      return getComputedStyle(this)[propertyName];
    } else if (typeof propertyName === 'object') {
      // 설정할 속성-값 쌍 객체.
      for (var key in propertyName) {
        this.style[key] = propertyName[key];
      }
    }
  } else {
    // 일치하는 모든 요소에 대해 하나 이상의 CSS 속성 설정하기.
    this.style[propertyName] = value;
  }
  return this;
};

/**
 *
 * @param newWidth
 * @returns {number}
 */
HTMLElement.prototype.width = function (newWidth) {
  if (newWidth === undefined) {
    // 일치하는 요소 집합 중 첫 번째 요소의 현재 계산된 너비를 가져옵니다.
    var style = getComputedStyle(this);
    return parseFloat(style.width);
  } else {
    // 일치하는 모든 요소에 대해 CSS 너비를 설정합니다.
    this.style.width = typeof newWidth === 'number' ? `${newWidth}px` : newWidth;
  }
};

/**
 *
 * @param includeMargin
 * @returns {number}
 */
HTMLElement.prototype.outerWidth = function (includeMargin) {
  var width = this.offsetWidth;
  if (includeMargin) {
    var style = getComputedStyle(this);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  }
  return width;
};

/**
 *
 * @param newHeight
 * @returns {number}
 */
HTMLElement.prototype.height = function (newHeight) {
  if (newHeight === undefined) {
    // 일치하는 요소 집합 중 첫 번째 요소의 현재 계산된 높이를 가져옵니다.
    var style = getComputedStyle(this);
    return parseFloat(style.height);
  } else {
    // 일치하는 모든 요소에 대해 CSS 높이를 설정합니다.
    this.style.height = typeof newHeight === 'number' ? `${newHeight}px` : newHeight;
  }
};

/**
 *
 * @param includeMargin
 * @returns {number}
 */
HTMLElement.prototype.outerHeight = function (includeMargin) {
  var height = this.offsetHeight;
  if (includeMargin) {
    var style = getComputedStyle(this);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  }
  return height;
};

/**
 *
 * @param newHtml
 * @returns {string}
 */
HTMLElement.prototype.html = function (newHtml) {
  if (newHtml === undefined) {
    // 일치하는 요소 집합 중 첫 번째 요소의 HTML 내용을 가져옵니다.
    return this.innerHTML;
  } else {
    // 일치하는 모든 요소에 대해 HTML 내용을 설정합니다.
    this.innerHTML = newHtml;

    // <script> 태그가 포함되어 있다면 재실행합니다.
    Array.from(this.getElementsByTagName('script')).forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
};

/**
 *
 * @param newHtml
 */
HTMLElement.prototype.appendHTML = function (newHtml) {
  // 새로운 HTML을 파싱하여 일시적인 div에 저장합니다.
  var temp = document.createElement('div');
  temp.innerHTML = newHtml;

  // 파싱된 노드들을 현재 요소에 추가합니다.
  while (temp.firstChild) {
    this.appendChild(temp.firstChild);
  }

  // <script> 태그가 포함되어 있다면 재실행합니다.
  Array.from(this.getElementsByTagName('script')).forEach((oldScript) => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

/**
 *
 * @param newHtml
 */
HTMLElement.prototype.prependHTML = function (newHtml) {
  // 새로운 HTML을 파싱하여 일시적인 div에 저장합니다.
  var temp = document.createElement('div');
  temp.innerHTML = newHtml;

  // 파싱된 노드들을 현재 요소의 시작 부분에 추가합니다.
  while (temp.firstChild) {
    this.insertBefore(temp.firstChild, this.firstChild);
  }

  // <script> 태그가 포함되어 있다면 재실행합니다.
  Array.from(this.getElementsByTagName('script')).forEach((oldScript) => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

/**
 *
 * @returns {{top: number, left: number}}
 */
HTMLElement.prototype.offset = function () {
  var rect = this.getBoundingClientRect();
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

/**
 *
 * @returns {{top: number, left: number}}
 */
HTMLElement.prototype.position = function () {
  return { top: this.offsetTop, left: this.offsetLeft };
};

/* // 2023-09-13 :: END :: HTMLElement */
