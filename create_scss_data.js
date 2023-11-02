const path = require('path');
const FileUtil = require('./file_util.js');
const _ = require('lodash');

const files = FileUtil.readdirs('./hbs', '.scss');

let arr = [];
files.forEach((f, idx) => {
  const path_obj = path.parse(f);
  const {dir, base} = path_obj;
  path_obj.path = `${dir.split('./')[1]}/${base}`;
  arr.push(`@use '${path_obj.path}';`);
});

const file_txt = arr.join('\n');
FileUtil.writeFile('module.scss', file_txt);
