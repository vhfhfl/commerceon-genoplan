// 카카오개발자센터 - https://developers.kakao.com/
// 카카오 지도 Web API - https://apis.map.kakao.com/web/guide/
const ADMIN_MAP_DATA_URL = '/assets/json/kakaomap_location_partner.json';
let INIT_LAT = 37.3957122;
let INIT_LNG = 127.1105181;
let LOCATION_LIST, KakaoMap;
const KakaoMapUtil = {};
/**
 * 장소 데이터 수신
 * @param callback
 */
KakaoMapUtil.loadJson = () => {
  let json;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    /*
    readyState
    0	UNSENT	Client has been created. open() not called yet.
    1	OPENED	open() has been called.
    2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
    3	LOADING	Downloading; responseText holds partial data.
    4	DONE	The operation is complete.
    */
    if (this.readyState == 4) {
      if (this.status == 200) {
        // success
        json = this.responseText;
      } else {
        // error
        const msg = '404 Not Found';
        console.log(`%c${msg}%c${path}`, 'font-family:D2Coding; border:1px solid black; background:red; color:white; padding:5px; font-size:12px;', 'font-family:D2Coding; background-color:black; border:1px solid black; border-left:none; padding:5px; color:yellow; font-size:12px;');
        json = msg + '<br/>' + path;
      }
    }
  };
  xhttp.open('GET', ADMIN_MAP_DATA_URL, false);
  xhttp.send();

  return JSON.parse(json);
};

/**
 * 주소 기반으로 위도 경도 등 좌표 데이터 수신
 * https://developers.kakao.com/docs/latest/ko/local/dev-guide#address-coord
 */
KakaoMapUtil.loadGeoData = () => {
  console.log(`LOCATION_LIST == `, LOCATION_LIST);

  const geo_list = [];

  getGeo(LOCATION_LIST[0]);

  /**
   * Geo Data 로드
   * @param location_obj
   */
  function getGeo(location_obj) {
    if (typeof location_obj === 'undefined') return;

    const { ADDRESS_NAME } = location_obj;

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(ADDRESS_NAME, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const geo = result[0];

        // ADMIN 에서 위도와 경도를 수동으로 입력했다면
        if (location_obj.위도 && location_obj.경도) {
          // Geocoder 를 통해 받아온 x y 값을 덮어 씌운다.
          geo.y = location_obj.위도;
          geo.x = location_obj.경도;
        }

        geo_list.push(geo);
        Object.assign(location_obj, geo);

        const next_idx = geo_list.length;
        if (next_idx == LOCATION_LIST.length) {
          // 끝
          KakaoMapUtil.drawMap();
        } else {
          // 다음 Geo 로드
          getGeo(LOCATION_LIST[next_idx]);
        }
      }
    });
  }
};

/**
 *
 */
KakaoMapUtil.drawMap = () => {
  if(LOCATION_LIST[0]){
    INIT_LAT = LOCATION_LIST[0].위도||LOCATION_LIST[0].y;
    INIT_LNG = LOCATION_LIST[0].경도||LOCATION_LIST[0].x;
  }
  
  // 맵 생성
  KakaoMap = creatMap();

  // 마커 생성
  LOCATION_LIST.forEach((geo, idx) => {
    const marker = createMarker(geo);
  });

  /* 2023-08-11 :: START :: 중심이동 */
  window.addEventListener('resize', (evt) => {
    const latlng = new kakao.maps.LatLng(INIT_LAT, INIT_LNG);
    KakaoMap.setCenter(latlng); // 곧장 이동
  });

  /* // 2023-08-11 :: END :: 중심이동 */

  /**
   * 지도 생성
   * https://apis.map.kakao.com/web/documentation/#Map
   */
  function creatMap() {
    var container = document.getElementById('KakaoMap'); //지도를 담을 영역의 DOM 레퍼런스

    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(INIT_LAT, INIT_LNG), //지도의 중심좌표.
      level: 4, //지도의 레벨(확대, 축소 정도)
    };

    return new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴;
  }

  /**
   * 마커 생성
   * https://apis.map.kakao.com/web/documentation/#Marker
   */
  function createMarker(geo) {
    if (typeof geo === 'undefined') {
      console.error('[kakaomap.js : createMarker] => geo is undefined');
      return;
    }

    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'; // 마커이미지의 주소입니다
    var imageWidth = 0;
    var imageHeight = 0;
    var imageSize = new kakao.maps.Size(imageWidth, imageHeight); // 마커이미지의 크기입니다
    var imageOption = { offset: new kakao.maps.Point(imageWidth/2, imageHeight) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 마커가 표시될 위치입니다
    var markerPosition = GetLatLng(geo);

    // 마커를 생성합니다
    var mk = new kakao.maps.Marker({
      position: markerPosition,
      //image: markerImage, // 마커이미지 설정
    });

    const co = createCustomOverlay(geo);

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(mk, 'click', function () {
      // 커스텀 오버레이 띄우기
      if(co) co.setVisible(true);
    });
    if(co) co.setVisible(true);

    // 마커가 지도 위에 표시되도록 설정합니다
    mk.setMap(KakaoMap);

    // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
    // mk.setMap(null);

    return mk;
  }

  /**
   * 커스텀 오버레이 생성
   * https://apis.map.kakao.com/web/documentation/#CustomOverlay
   * https://apis.map.kakao.com/web/guide/#mapurl
   */
  function createCustomOverlay(geo) {
    const { PLACE_NAME, ADDRESS_NAME, OVERLAY_LINK, OVERLAY_IMG } = geo;

    if (OVERLAY_IMG) {
      // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      const content = `
      <div class="customoverlay">
        <a href="${OVERLAY_LINK}" target="_blank">
          <img style="max-width:none;" src="${OVERLAY_IMG}" alt="" />
        </a>
      </div>
      `;
      // 커스텀 오버레이가 표시될 위치입니다
      var position = GetLatLng(geo);

      // 커스텀 오버레이를 생성합니다
      var customOverlay = new kakao.maps.CustomOverlay({
        map: KakaoMap,
        position: position,
        content: content,
        // yAnchor: 1,
        xAnchor: 0,
        yAnchor: 0,
        zIndex: 3,
      });

      // 가려두기
      customOverlay.setVisible(false);

      return customOverlay;
    } else {
      return false;
    }
    
    
  }
};

/**
 * 지도 이동
 */
KakaoMapUtil.moveToMap = (place_name) => {
  const geo = LOCATION_LIST.filter((obj) => {
    return place_name == obj.PLACE_NAME;
  })[0];
  const latlng = GetLatLng(geo);
  INIT_LAT = geo.y;
  INIT_LNG = geo.x;
  KakaoMap.panTo(latlng); // 부드럽게 이동
};

/**
 * 지도 초기화
 */
KakaoMapUtil.init = () => {
  const json = KakaoMapUtil.loadJson();
  let { GEO_DATA } = json;
  LOCATION_LIST = GEO_DATA;

  // 임포트 끝나면 지도 셋팅 시작
  KakaoMapUtil.loadGeoData();
  
};

function GetLatLng(geo) {
  const lat = geo.y; // 위도
  const lng = geo.x; // 경도
  return new kakao.maps.LatLng(lat, lng);
}

window.addEventListener('DOMContentLoaded', (evt) => {
  KakaoMapUtil.init();
});
