/**
 * 사이트가 열려있는 동안 지속 실행 되는 명령들
 */
const EnterFrame = {};

(function repeat_callback() {
  // 지속 실행 명령
  requestAnimationFrame(repeat_callback);
})();
