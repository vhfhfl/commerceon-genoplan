/**
 * InputUi 초기 셋팅
 * @param trigger
 */
const initInputUi = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const el_inp = el_target.querySelector(`:scope > input`);

  el_inp.addEventListener('keyup', (evt) => {
    updateDisplay();
  });

  el_inp.addEventListener('focus', (evt) => {
    el_target.classList.add('Focus');
    el_target.focus();
  });

  el_inp.addEventListener('blur', (evt) => {
    el_target.classList.remove('Focus');
    el_target.blur();
  });

  updateDisplay();

  function updateDisplay() {
    const value = el_inp.value;

    if (!value) {
      el_target.classList.remove('HasValue');
    } else {
      el_target.classList.add('HasValue');
    }
  }
};

/**
 * HScrollGradientBox 가로 스크롤 그라디언트 박스 초기 셋팅
 * @param trigger
 */
const initHScrollGradientBox = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const el_hsb = el_target;
  const el_track = el_hsb.querySelector(`.Track`);
  el_track.addEventListener('scroll', (evt) => {
    updateDisplay();
  });
  updateDisplay();

  function updateDisplay() {
    const sw = el_track.scrollWidth;
    const sl = Math.ceil(el_track.scrollLeft);
    const k = sw - sl;

    if (k == sw) {
      el_hsb.classList.add('Start');
    } else {
      el_hsb.classList.remove('Start');
    }

    if (k <= el_track.clientWidth) {
      el_hsb.classList.add('End');
    } else {
      el_hsb.classList.remove('End');
    }
  }
};

/**
 *
 * @param trigger
 */
const initCollapse = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $li_on = $('li.On', el_target);
  $li_on.find('.A').show();

  const $qbtn = $('.Q > button', el_target);
  $qbtn.on('click', (evt) => {
    const $li = $(evt.currentTarget).closest('li');

    if (!$li.hasClass('On')) {
      const $li_siblings = $li.siblings('li');

      $li_siblings.removeClass('On');
      $li_siblings.find('.A').slideUp();

      $li.addClass('On');
      $li.find('.A').slideDown();
    } else {
      $li.removeClass('On');
      $li.find('.A').slideUp();
    }
  });
};

/**
 *
 * @param trigger
 */
const initTreeMenu = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;

  const $li_on = $('li.On', el_target);
  $li_on.find('> ul').show();

  const $button = $('button', el_target);
  $button.on('click', (evt) => {
    const $li = $(evt.currentTarget).closest('li');

    if (!$li.hasClass('On')) {
      const $li_siblings = $li.siblings('li');

      $li_siblings.removeClass('On');
      $li_siblings.find('> ul').slideUp();

      $li.addClass('On');
      $li.find('> ul').slideDown();
    } else {
      $li.removeClass('On');
      $li.find('> ul').slideUp();
    }
  });
};

const initFullPageSwiper = (swiper_id) => {
  const pagination_progress = {
    el: `${swiper_id}-PagenationProgressbar`,
    type: 'progressbar',
    modifierClass: 'Pagenation-',
    progressbarFillClass: 'FillBar',
    renderProgressbar: function (className) {
      return `<div class="${className}"></div>`;
    },
  };

  const swiper_option = {
    // initialSlide : 3,
    direction: 'vertical',
    mousewheel: true,
    releaseOnEdges: true,
    slidesPerView: 1, // 슬라이드의 수가 slidesPerView의 값 2배 이상이어야함. slidesPerView, slidesPerGroup 함께 설정 필요.
    slidesPerGroup: 1,
    loop: false,
    pagination: pagination_progress,
    // autoplay: {
    //   delay: 1000,
    //   disableOnInteraction: false,
    // },
    init: false,
    // grabCursor: true,
  };

  const nextSlide = $('.BtnNextSlide');
  nextSlide.on('click', (evt) => {
    swiper.slideNext(500);
  });

  let swiper = new Swiper(swiper_id, swiper_option);

  swiper.on('init', function (swiper) {
    setCurrentSectionIdx();
    setAnimateDealy();

    // 첫화면 진입때만 애니메이션 작동 안하게
    const $first_active_slide = $(swiper.slides[0]);
    if ($first_active_slide.hasClass('swiper-slide-active')) {
      $first_active_slide.addClass('FirstPlay');
      setTimeout(() => {
        $first_active_slide.removeClass('FirstPlay');
      }, 1000);
    }
  });

  swiper.on('slideChange', function (swiper) {
    setCurrentSectionIdx();
    setAnimateDealy();

    if (!swiper.isEnd) {
      const $el = $(swiper.el);
      $el.removeClass('MoveUp');
    }
  });

  swiper.on('resize', function (swiper) {
    setFooterSnap(swiper);
  });

  swiper.on('beforeTransitionStart', function (swiper) {
    setFooterSnap(swiper);
  });

  function setFooterSnap(swiper) {
    // 슬라이드가 2개도 안되면 풀페이지 스크롤을 할 이유가 없지 리턴 시켜
    if (swiper.slides.length < 2) return;

    const last_idx = swiper.slides.length - 1;
    const $last_slide = $(swiper.slides[last_idx]);
    const ls_hei = $last_slide.outerHeight();
    const second_last_snap = swiper.snapGrid[last_idx - 1];
    const cal_last_snap = second_last_snap + ls_hei;
    swiper.snapGrid[last_idx] = cal_last_snap;
  }

  swiper.init();

  function setAnimateDealy() {
    const $el = $(swiper.el);

    // 슬라이드 방향 체크해서
    // 트렌지션 객체들 딜레이 각각 설정해주기
    if (swiper.previousIndex - swiper.activeIndex > 0) {
      $el.css('--ori-top', `-50px`);
    } else {
      $el.css('--ori-top', `50px`);
    }

    const el_slide = swiper.slides[swiper.activeIndex];
    const $dov = $(el_slide).find('[data-only-view]');
    $dov.each(function (i) {
      const $at = $('.AnimateTarget', this);
      $at.each(function (j) {
        const k = 2;
        $(this).css('animation-delay', `${j * k}00ms`);
      });
    });
  }

  function setCurrentSectionIdx() {
    const { realIndex } = swiper;
    $('html').attr('data-current-section-idx', realIndex);
  }
};

/**
 *
 * @param trigger
 */
const initWheelDownHScrollWrap = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const el_inner = el_target.querySelector(`:scope > .Inner`);
  const el_inner_child = el_inner.querySelectorAll(`:scope > div`);

  window.addEventListener('resize', (evt) => {
    updateDisplay();
  });

  window.addEventListener('scroll', (evt) => {
    updateDisplay();
  });
  
  el_inner.addEventListener('scroll', (evt) => {
    checkHScrollActive();
  });

  updateDisplay();
  function updateDisplay() {
    const { scrollWidth, clientWidth, clientHeight } = el_inner;
    const wrapHeight = scrollWidth + clientHeight - clientWidth;
    const scrollRange = scrollWidth - clientWidth;

    el_target.height(wrapHeight);

    const top = el_target.getBoundingClientRect().top;
    
    const k = -1 * top;
    el_inner.scrollLeft = k;

  }
  
  function checkHScrollActive() {
    el_inner_child.forEach((el_child, idx) => {
      const left = el_child.getBoundingClientRect().left;
      const k = left;

      if (k <= 960) {
        el_child.addClass('On');
      } else {
        el_child.removeClass('On');
      }
    });
  }
};

/**
 * 
 * @param trigger
 */
function initSearchInp(trigger) {
  if (typeof trigger === 'undefined') return;

  const el_target = trigger.parentElement;
  const el_del_btn = el_target.querySelector('.DelBtn');
  const el_target_inp = el_target.querySelector('input[type="text"]');

  el_del_btn.addEventListener('click', (evt) => {
    console.log(evt);
    el_target_inp.value = '';
    updateDisplay();
  });

  el_target_inp.addEventListener('keyup', (evt) => {
    updateDisplay();
  });

  updateDisplay();
  function updateDisplay(){
    const current_value = el_target_inp.value.trim();

    if (current_value == ''){
      el_del_btn.classList.remove('On');
    } else {
      el_del_btn.classList.add('On');
    }
  }
};
