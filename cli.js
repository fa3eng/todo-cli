const { Command } = require('commander');
const api = require('./index.js');

const program = new Command();

program
  .command('add <taskName...>')
  .description('add task 添加任务')
  .action((...taskName) => {
    const task = taskName.slice(0, -2);
    api.add(task.join(' '));
  });

program
  .command('remove')
  .description('remove all task 清除所有任务')
  .action(() => {
    api.remove();
  });

program
  .command('list')
  .description('show all task 展示所有的任务')
  .action(() => {
    api.showAll();
  })

program
  .command('test')
  .description('一个用来测试的api')
  .action(() => {
    api.test();
  })

program.parse(process.argv);