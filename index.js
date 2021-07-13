const db = require('./db');
const { printList } = require('./method.js');

const add = async (taskName) => {
  // 1. 读取todo
  const list = await db.read();
  // 2. 添加任务
  list.push({ title: taskName, done: false });
  // 3. 存储到本地
  await db.write(list);
}

const remove = async () => {
  await db.write([]);
}

const showAll = async () => {
  const list = await db.read();
  printList(list);
}

module.exports = {
  add,
  remove,
  showAll
}