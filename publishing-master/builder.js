const address = require('address');
const host = address.ip();

// html 이 만들어지는 폴더
const bundle_folder = './dist/html';

// 사용하려는 기본 포트 번호
const desiredPort = 3001;
const qs = require('querystring');
const http = require('http');
const fs = require('fs');
// Programmatic access
const beautify_js = require('js-beautify'); // also available under "js" export
const beautify_css = require('js-beautify').css;
const beautify_html = require('js-beautify').html;
const FileUtil = require('./file_util.js');

let server;
// 서버 생성 함수
const createServer = (port) => {
  server = http.createServer(function (request, response) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'text/plain; charset=utf-8',
      //'Access-Control-Max-Age': 2592000, // 30 days
    };

    let url = request.url;
    // console.log(`url == `, url);

    if (request.method == 'POST') {
      if (url == '/save') {
        // url = '/index.html';
        
        let body = [];
        
        request.on('data', (chunk) => {
          // console.log('데이터 수신 시작');
          body.push(chunk);
        });

        request.on('end', () => {
          // console.log('데이터 수신 완료');
          
          // Buffer 객체로 병합 및 문자열 변환
          body = Buffer.concat(body).toString();

          const { name, body_str } = JSON.parse(body);
          const save_path = `${bundle_folder}/${name}.html`;
          
          let build_frame_str = FileUtil.readFile('./builder.html');
          let head_html = FileUtil.readFile('./head.html');
          build_frame_str = build_frame_str.replace(/__헤드__/gi, head_html);
          build_frame_str = build_frame_str.replace(/__컨텐츠__/gi, body_str);
          
          const options = { indent_size: 2, space_in_empty_paren: true }
          const result_str = beautify_html(build_frame_str, options);
          
          FileUtil.writeFile(save_path, result_str);

          response.writeHead(200, headers);
          const obj = {
            msg: 'SUCCESS',
            file: save_path,
          };
          response.end(JSON.stringify(obj));
        });
      }
    }
  });

  server.listen(port, () => {
    console.log('\x1b[33m%s\x1b[0m', `=============================== Server is running on http://${host}:${port}`);
    console.log('\x1b[33m%s\x1b[0m', `=============================== Server is running on http://localhost:${port}`);
    FileUtil.writeFile('./pub_tool/PORT_NUMBER.js', `var PORT_NUMBER = ${port};`);
  });
};

// 기본 포트로 서버 시작 시도
createServer(desiredPort);

// 기본 포트가 사용 중일 경우 처리
// 에러가 발생할 경우 다른 포트로 재시도
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // https://github.com/shiena/ansicolor/blob/master/README.md
    console.log('\x1b[31m%s\x1b[0m', `=============================== Port ${desiredPort} is already in use.`);

    // 다른 포트로 재시도를 위해 기본 포트 번호 + 1 로 변경
    const alternativePort = desiredPort + 1;
    console.log('\x1b[31m%s\x1b[0m', `=============================== Trying an alternative port: ${alternativePort}`);

    createServer(alternativePort);
  } else {
    // 다른 에러가 발생한 경우에 대한 처리
    console.error('An error occurred while starting the server:', err);
  }
});

// netstat -ano | findstr 3001
// taskkill /f /pid PID번호
