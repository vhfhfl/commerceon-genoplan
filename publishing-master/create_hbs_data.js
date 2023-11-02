const path = require('path');
const FileUtil = require('./file_util.js');
const _ = require('lodash');

const files = FileUtil.readdirs('./hbs', '.hbs');

let arr = [];
files.forEach((f, idx) => {
  const path_obj = path.parse(f);
  const folder_name = path_obj.dir.split('./hbs/')[1];
  const {dir, base} = path_obj;
  path_obj.folder_name = folder_name;
  path_obj.path = `${dir.split('./')[1]}/${base}`;
  arr.push(path_obj);
  
});
arr = _.groupBy(arr, 'folder_name');

const file_txt = `var HBS_DATA = ${JSON.stringify(arr)};`;
FileUtil.writeFile('./pub_tool/HBS_DATA.js', file_txt);
