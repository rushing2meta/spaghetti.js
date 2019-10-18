const fs = require("fs");
const util = require("util");
const lStat = util.promisify(fs.lstat);
const readDir = util.promisify(fs.readdir);

async function RequireAll(path) {
  console.log(__dirname);

  const files = await readDir(path);
  const modules = [];

  for (let i = 0; i < files.length; i++) {
    const parsedPath = `${path}/${files[i]}`;

    if ((await lStat(parsedPath)).isDirectory() && !files[i].startsWith("."))
      modules.push(...await RequireAll(parsedPath));
    else if (files[i].endsWith(".js") || files[i].endsWith(".json"))
      modules.push(require(parsedPath));
  }

  return modules;
}

module.exports = RequireAll;
