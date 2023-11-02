(() => {
  function isLocalTestServer() {
    const hostname = window.location.hostname;

    // hostname이 localhost인지 확인
    if (hostname === 'localhost') {
      return true;
    }

    // hostname이 IP 주소 형식인지 확인
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    if (ipPattern.test(hostname)) {
      return true;
    }

    return false;
  }

  if(!isLocalTestServer()) window.location.href = `/blank.html`;
})();