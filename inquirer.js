import inquirer from "inquirer"

const options = [
  {
    type:"input",
    message:"你的低代码json id是什么？",
    name:"id",
    validate: function(answer) {
      if (answer.length < 1) {
        return '请输入低代码json id.';
      }
  
      return true;
    },
  },
  {
    type:"input",
    message:"在当前哪个目录下创建文件？",
    name:"path",
    default:"src"
  }
]
inquirer
  .prompt(options)
  .then(answers => {
    // 回调，对用户输入的答案就行处理
    console.log(answers)
  });