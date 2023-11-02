window.addEventListener('DOMContentLoaded', (event) => {
  
  const html = `
  <style>
    #AppInfo{ display:none; }
    [data-env="development"] #AppInfo{ display:block; }
    #AppInfo > a{ z-index:9999; position:fixed; top:0px; left:50%; }
    #AppInfo > a{ display:flex; align-items:center; justify-content:center; gap:4px; }
    #AppInfo > a{ color:yellow; font-size:12px; font-weight:400; }
    #AppInfo > a{ background-color:rgba(0,0,0,.7); cursor:pointer; white-space:nowrap; padding:4px; }
    #AppInfo > a{ transform:translateX(-50%) translateY(-100%); }
    [data-wheel-direction='down'] #AppInfo > a{ transform: translateX(-50%) translateY(0%); }
  </style>
  <div id="AppInfo">
    <a href="/index.html?page=_pub_sitemap">
      <div>
        <div data-only-view="Xs">Xs</div>
        <div data-only-view="Sm">Sm</div>
        <div data-only-view="Md">Md</div>
        <div data-only-view="Lg">Lg</div>
        <div data-only-view="Xl">Xl</div>
        <div data-only-view="2Xl">2Xl</div>
        <div data-only-view="3Xl">3Xl</div>
      </div>
      <div>|</div>
      <div class="wid">wid</div>
      <div>x</div>
      <div class="hei">hei</div>
    </a>
  </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', html);

  const UA = UAParser();

  const init = () => {
    (() => {
      // 번들링 결과물에서는 링크 변경
      if (document.documentElement.dataset.env != 'development') {
        document.querySelector(`#AppInfo > a`).setAttribute(`href`, `/html/_pub_sitemap.html`);
      } else {
        const c_label = 'env';
        const c_label_style =
          'border:1px solid black; background:#333; color:yellow; padding:0.25em 0.5em; font-size:12px; font-weight:bold;';
        const c_value = document.documentElement.dataset.env;
        const c_value_style =
          'border:1px solid black; background:#ffffd4; color:#333; padding:0.25em 0.5em; font-size:12px; border-left:none;';
        console.log(`%c${c_label}%c${c_value}`, c_label_style, c_value_style);
      }
    })();

    infoDeviceOS();
    infoWhellDirection();
    infoOnTouch();
    infoWhellDirection();
    infoScrollDirection();
    infoReadyState();
    infoPath();
    infoScrollTop();
    infoBreakPoint();
    infoiOSSafeArea();
  };
  init();

  function infoDeviceOS() {
    const device = UA.device;
    const os = UA.os;
    const cpu = UA.cpu;
    const browser = UA.browser;
    const engine = UA.engine;

    const el_html = document.querySelector('html');
    el_html.setAttribute(`data-device-model`, device.model);
    el_html.setAttribute(`data-device-type`, device.type);
    el_html.setAttribute(`data-device-vendor`, device.vendor);

    el_html.setAttribute(`data-os-name`, os.name);
    el_html.setAttribute(`data-os-version`, os.version);

    el_html.setAttribute(`data-cpu`, cpu.architecture);

    el_html.setAttribute(`data-browser-model`, browser.major);
    el_html.setAttribute(`data-browser-name`, browser.name);
    el_html.setAttribute(`data-browser-version`, browser.version);

    el_html.setAttribute(`data-engine-name`, engine.name);
    el_html.setAttribute(`data-engine-version`, engine.version);
  }

  function infoScrollTop() {
    const el_html = document.querySelector('html');

    function update() {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      el_html.setAttribute('data-scroll-top', st);
    }

    update();

    window.addEventListener('scroll', (evt) => {
      update();
    });
  }

  function infoWhellDirection() {
    const el_html = document.querySelector('html');

    window.addEventListener('wheel', function (event) {
      if (event.deltaY < 0) {
        el_html.setAttribute(`data-wheel-direction`, 'up');
      } else if (event.deltaY > 0) {
        el_html.setAttribute(`data-wheel-direction`, 'down');
      }
    });
  }

  function infoOnTouch() {
    const el_html = document.querySelector('html');
    el_html.setAttribute('data-is-touch', false);

    document.addEventListener('touchstart', (evt) => {
      el_html.setAttribute('data-is-touch', true);
    });

    document.addEventListener('touchend', (evt) => {
      el_html.setAttribute('data-is-touch', false);
    });
  }

  function infoScrollDirection() {
    const el_html = document.querySelector('html');
    el_html.setAttribute('data-scroll-diretion', '');

    let prevSt = 0;
    let prevDir;
    let distance = 0;

    function update() {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st <= 0) st = 0;
      const limit_y = el_html.scrollHeight - el_html.clientHeight;
      if (limit_y <= st) st = limit_y;

      if (st > 0 && limit_y > st) {
        let dir;
        if (prevSt - st > 0) {
          dir = 'up';
        } else {
          dir = 'down';
        }

        distance += prevSt - st;

        if (prevDir != dir) {
          // console.log('dir change!');
          distance = 0;
        }

        const distance_k = 0;
        if (Math.abs(distance) > distance_k) {
          el_html.setAttribute('data-scroll-diretion', dir);
        }

        prevDir = dir;
        prevSt = st;
      }
    }

    update();

    window.addEventListener('scroll', (evt) => {
      update();
    });
  }

  function infoReadyState() {
    document.addEventListener('readystatechange', () => {
      const el_html = document.querySelector('html');
      el_html.setAttribute(`data-ready-state`, document.readyState);
      if (document.readyState === 'complete') {
        el_html.setAttribute(`data-is-loading`, false);
      } else {
        el_html.setAttribute(`data-is-loading`, true);
      }
    });
  }

  function infoPath() {
    const el_html = document.querySelector('html');
    const path = window.location.pathname;
    el_html.setAttribute(`data-path`, path);
  }

  function infoBreakPoint() {
    const el_html = document.querySelector('html');

    function update() {
      const wid = window.innerWidth;
      let prefix = '';
      if (wid < 640) prefix = 'xs';
      if (640 <= wid && wid < 768) prefix = 'sm';
      if (768 <= wid && wid < 1024) prefix = 'md';
      if (1024 <= wid && wid < 1280) prefix = 'lg';
      if (1280 <= wid && wid < 1536) prefix = 'xl';
      if (1536 <= wid && wid < 1800) prefix = '2xl';
      if (1800 <= wid) prefix = '3xl';
      el_html.setAttribute(`data-app-breakpoint`, prefix);

      const el_wid = document.querySelector(`#AppInfo .wid`);
      el_wid.textContent = wid;

      const el_hei = document.querySelector(`#AppInfo .hei`);
      el_hei.textContent = window.innerHeight;

      /*
      if (UA.device.type == 'mobile') {
      } else {
      }
      */
    }

    update();

    window.addEventListener('resize', (evt) => {
      update();
    });
  }

  function infoiOSSafeArea() {
    const el_html = document.documentElement;
    const html_style = getComputedStyle(el_html);
    const sab = html_style.getPropertyValue('--sab');
    el_html.setAttribute(`data-safe-area-bottom`, sab);
  }

  function infoWhellDirection() {
    const el_html = document.querySelector('html');
    el_html.setAttribute(`data-wheel-direction`, '');

    window.addEventListener('wheel', function (event) {
      if (event.deltaY < 0) {
        el_html.setAttribute(`data-wheel-direction`, 'up');
      } else if (event.deltaY > 0) {
        el_html.setAttribute(`data-wheel-direction`, 'down');
      }
    });
  }
});
