const path = require('path');
const fs = require('fs');

// const FileUtil = require('./file_util.js');
const FileUtil = {};

/**
 * 폴더내의 모든 파일 리스트 반환
 * @param dir
 * @param files
 * @returns {*[]}
 */
FileUtil.readdirs = function (dir, ext, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      FileUtil.readdirs(name, ext, files);
    } else {
      const path_obj = path.parse(name);
      if (ext) {
        if (ext == path_obj.ext) {
          files.push(name);
        }
      } else {
        files.push(name);
      }
    }
  }
  return files;
};

/**
 *
 * @param file_path
 * @returns {*}
 */
FileUtil.readFile = function (file_path) {
  let result = fs.readFileSync(`${file_path}`).toString();
  return result;
};

/**
 * 파일 생성
 * @param write_file_path
 * @param contents
 */
FileUtil.writeFile = function (write_file_path, contents, cb) {
  fs.mkdir(path.dirname(write_file_path), { recursive: true }, function (err) {
    if (err) return cb(err);

    try {
      fs.writeFileSync(write_file_path, contents, { encoding: 'utf8' });
      // https://github.com/shiena/ansicolor/blob/master/README.md
      console.log('\x1b[94m%s\x1b[0m', `=============================== Write Complete : ${write_file_path} `);
    } catch (err) {
      console.error(err);
    }
  });
};

FileUtil.isExist = (file_path) => {
  return fs.existsSync(file_path);
}

module.exports = FileUtil;
