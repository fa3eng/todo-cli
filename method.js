const inquirer = require('inquirer');
const db = require('./db');

/**
 * 返回list界面
 */
const backList = async () => {
  const list = await db.read();
  await printList(list);
}

/**
 * 标记为完成
 * @param {*} item 需要操作的选项
 */
const finished = async (item) => {
  const list = await db.read();

  const result = list.map((elem, index) => {
    if (item === index) {
      return { title: elem.title, done: true };
    }

    return elem;
  });

  await db.write(result);
}

/**
 * 标记为未完成
 * @param {*} item 需要操作的选项
 */
const unfinished = async (item) => {
  const list = await db.read();

  const result = list.map((elem, index) => {
    if (item === index) {
      return { title: elem.title, done: false };
    }

    return elem;
  });

  await db.write(result);
}

/**
 * 修改对应选项
 * @param {*} item 需要操作的选项
 */
const modify = async (item) => {
  const list = await db.read();

  await inquirer
    .prompt([
      {
        type: 'input',
        name: "modify",
        message: "你想怎么修改?",
      }
    ]).then(async (answer) => {
      const result = list.map((elem, index) => {
        if (index === item) {

          return { title: answer.modify, done: false };
        }

        return elem;
      });

      await db.write(result);
    })
}

/**
 * 删除对应的选项
 * @param {*} item 需要删除的选项
 */
const deleteList = async (item) => {
  const list = await db.read();

  const result = list.filter((_, index) => {
    return index === item ? false : true;
  });

  await db.write(result);
}

/**
 * 对某个代办事项进行操作
 * @param {*} item todo-list
 */
const operation = async (item) => {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "operation",
        message: "选择操作\n",
        choices: [
          { name: '返回上一级', value: 'back' },
          { name: '已完成', value: 'finished' },
          { name: '未完成', value: 'unfinished' },
          { name: '修改', value: 'modify' },
          { name: '删除', value: 'deleteList' },
        ]
      }
    ])
    .then(async (answers) => {
      if (answers.operation === 'back') {
        console.log('back');
        await backList();
      } else if (answers.operation === 'finished') {
        await finished(item);
        await backList();
      } else if (answers.operation === 'unfinished') {
        await unfinished(item);
        await backList();
      } else if (answers.operation === 'modify') {
        await modify(item);
        await backList();
      } else if (answers.operation === 'deleteList') {
        await deleteList(item);
        await backList();
      }
    })
}


const printList = async (list) => {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "Todo List\n",
        default: "",
        choices: [
          { name: '退出', value: '-1' },
          ...list.map((item, index) => {
            return { name: `${item.done ? '[完成]' : '[未完成]'} ${item.title}`, value: index }
          })
        ]
      }
    ])
    .then((answers) => {
      if (answers.index >= 0) {
        // 继续对单个的选项进行操作
        operation(answers.index);
      } else if (answers.index === '-1') {
        console.log('退出');
      }
    })
}

module.exports = {
  printList
}