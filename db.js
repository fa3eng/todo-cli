const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');
const home = process.env.HOME || homedir;
const dbPath = path.join(home, '.todo');

/**
 * 操作读写的类
 */
const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
        if(error) return reject(error);
        let list = '';
        try {
          list = JSON.parse(data.toString());
        } catch(err) {
          // 如果.todo文件中没有东西
          list = [];
        }       
        resolve(list);
      })
    })
  },

  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list)+'\n', (error) => {
        if(error) return reject(error)
        resolve();
      })
    })
  }
}

module.exports = db;