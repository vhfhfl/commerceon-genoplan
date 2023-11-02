let PageName, DocTitle;
(() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  PageName = urlParams.get('page');
  if (!PageName) window.location = '/index.html?page=_pub_sitemap';
  DocTitle = urlParams.get('title');
  if (DocTitle) document.title = DocTitle;
})();

(() => {
  // 사이트맵에서만 메뉴데이터 로드
  if (PageName != '_pub_sitemap' && PageName != 'sitemap') return;

  const loadJson = (path, callback) => {
    let result;
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', path, true);
    xhttp.responseType = 'arraybuffer';

    xhttp.onload = function (e) {
      var arraybuffer = xhttp.response;
      var data = new Uint8Array(arraybuffer);
      var workbook = XLSX.read(data, { type: 'array' });
      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
      var json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // json 가공
      // 첫번째 row 를 기준으로 비어있는 값에 null 값을 넣어준다.
      var first_row_data = json[0];
      var col_len = first_row_data.length;

      json.forEach((obj, idx) => {
        let i = 0;
        while (i < col_len) {
          if (obj[i]) {
            // console.log(obj[i]);
          } else {
            obj[i] = null;
          }
          ++i;
        }
      });

      let result_array = [];
      // index 값 기반을 첫번째 row 의 값 기준 데이터로 변환
      json.forEach((obj, idx) => {
        const new_obj = {};
        if (idx != 0) {
          // console.log(first_row_data);
          obj.forEach((obj2, idx2) => {
            new_obj[first_row_data[idx2]] = obj2;
            //console.log(obj2);
          });

          result_array.push(new_obj);
        }
      });

      callback(result_array);
    };

    xhttp.send();
  };

  const saveLocalData = (json) => {
    let arr = [];

    // child 노드 추가
    json.forEach((el, index) => {
      el.child = [];
    });

    let d1_el;
    let d2_el;
    let d3_el;
    json.forEach((el, index) => {
      // 뎁스1 넣기
      const d1 = el['뎁스1'];
      if (d1) {
        el.path = reaplceStr(d1);

        d2_el = undefined;
        d3_el = undefined;
        d1_el = el;

        arr.push(d1_el);
      }

      const d2 = el['뎁스2'];
      if (d2) {
        el.path = d1_el.path + '/' + reaplceStr(d2);

        d3_el = undefined;
        d2_el = el;
        d1_el.child.push(d2_el);

        // data.splice(index, 1);
      }

      const d3 = el['뎁스3'];
      if (d3) {
        el.path = d2_el.path + '/' + reaplceStr(d3);

        d3_el = el;
        d2_el.child.push(d3_el);
      }
    });

    window.MENU_DATA = arr;

    window.MENU_DATA_FOR_GUEST = window.MENU_DATA.filter((obj) => {
      const { 뎁스1 } = obj;
      if (뎁스1 == '퍼블전용') {
        return false;
      } else {
        return true;
      }
    });

    /**
     * 특수문자 및 공백 제거
     * @param string
     * @returns {string}
     */
    function reaplceStr(string) {
      if (typeof string == 'number') string = string.toString();
      // eslint-disable-next-line
      const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
      return string.replace(regExp, '');
    }
  };

  loadJson('/MENU_DATA.xlsx', (json) => {
    saveLocalData(json);
  });
})();
