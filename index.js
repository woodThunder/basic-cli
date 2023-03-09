#!/usr/bin/env node
import fs from 'fs'
import fsExtra from 'fs-extra'
import beautify from 'js-beautify'
import inquirer from "inquirer"
import chalk from 'chalk'
import ora from 'ora'
import { getTemplate } from "./core/generator.js"
import { beautifierOpts } from "./core/beautify.js"
import { request } from './core/request.js'
const defaultObj = {
  "sole": {
    title: "角色管理",
    path: "/sole",
    widgetList: [
      {
        "key": 54136,
        "type": "sub-form",
        "category": "container",
        "icon": "sub-form",
        "widgetList": [
          {
            "key": 81517,
            "type": "textarea",
            "icon": "textarea-field",
            "formItemFlag": true,
            "options": {
              "name": "textarea68036",
              "label": "textarea",
              "labelAlign": "",
              "rows": 3,
              "defaultValue": "",
              "placeholder": "",
              "columnWidth": "200px",
              "size": "",
              "labelWidth": null,
              "labelHidden": false,
              "readonly": false,
              "disabled": false,
              "hidden": false,
              "required": false,
              "requiredHint": "",
              "validation": "",
              "validationHint": "",
              "customClass": [],
              "labelIconClass": null,
              "labelIconPosition": "rear",
              "labelTooltip": null,
              "minLength": null,
              "maxLength": null,
              "showWordLimit": false,
              "onCreated": "",
              "onMounted": "",
              "onInput": "",
              "onChange": "",
              "onFocus": "",
              "onBlur": "",
              "onValidate": ""
            },
            "id": "textarea68036"
          }
        ],
        "options": {
          "modelName": "formData32",
          "refName": "vForm32",
          "rulesName": "rules32",
          "labelWidth": 80,
          "labelPosition": "top",
          "size": "",
          "labelAlign": "label-left-align",
          "cssCode": "",
          "customClass": [],
          "functions": "",
          "layoutType": "PC",
          "jsonVersion": 3,
          "onFormCreated": "",
          "onFormMounted": "",
          "onFormDataChange": "",
          "name": "subform88765"
        },
        "id": "subform88765"
      }
    ]
  },
  "btn": {
    title: "角色管理",
    path: "/sole",
    widgetList: [
      {
        "key": 54136,
        "type": "sub-form",
        "category": "container",
        "icon": "sub-form",
        "widgetList": [
          {
            "key": 81517,
            "type": "textarea",
            "icon": "textarea-field",
            "formItemFlag": true,
            "options": {
              "name": "textarea68036",
              "label": "textarea",
              "labelAlign": "",
              "rows": 3,
              "defaultValue": "",
              "placeholder": "",
              "columnWidth": "200px",
              "size": "",
              "labelWidth": null,
              "labelHidden": false,
              "readonly": false,
              "disabled": false,
              "hidden": false,
              "required": false,
              "requiredHint": "",
              "validation": "",
              "validationHint": "",
              "customClass": [],
              "labelIconClass": null,
              "labelIconPosition": "rear",
              "labelTooltip": null,
              "minLength": null,
              "maxLength": null,
              "showWordLimit": false,
              "onCreated": "",
              "onMounted": "",
              "onInput": "",
              "onChange": "",
              "onFocus": "",
              "onBlur": "",
              "onValidate": ""
            },
            "id": "textarea68036"
          }
        ],
        "options": {
          "modelName": "formData32",
          "refName": "vForm32",
          "rulesName": "rules32",
          "labelWidth": 80,
          "labelPosition": "top",
          "size": "",
          "labelAlign": "label-left-align",
          "cssCode": "",
          "customClass": [],
          "functions": "",
          "layoutType": "PC",
          "jsonVersion": 3,
          "onFormCreated": "",
          "onFormMounted": "",
          "onFormDataChange": "",
          "name": "subform88765"
        },
        "id": "subform88765"
      }
    ]
  },
  user: {}
}

const options = [
  {
    type: "input",
    message: "你的低代码json id是什么？",
    name: "id",
    validate: function (answer) {
      if (answer.length < 1) {
        return '请输入低代码json id。';
      }

      return true;
    },
  },
  {
    type: "input",
    message: "在当前哪个目录下创建文件？\n " + chalk.bold.red("请谨慎操作，会清空文件夹下的所有文件！"),
    name: "path",
    default: "src",
    validate: function (answer) {
      if (answer.endsWith("/")) {
        return '路径结尾不需要加/';
      }

      return true;
    },
  }
]

let loading = null
// 
inquirer
  .prompt(options)
  .then(answers => {
    // 判断当前路径是否存在
    const currentPathExists = fsExtra.pathExistsSync(answers.path)
    if(currentPathExists) {
      init(answers)
    }else{
      console.error(chalk.bold.red(`路径 ${answers.path} 不存在，请先创建！`));
    }
  })

// 初始化
function init (answers) {
  // 加载开始
  loading = ora({
    text: chalk.bgYellowBright('Loading...'),
    spinner: 'bouncingBall', // 动画样式
    color: 'yellow'
  }).start();
  
  const { path, id } = answers
  // 请求json文件
  requestJsonAPI(id, (data) => {
    // 创建文件
    createFile(path, data)
  })
}

// 请求json API
function requestJsonAPI (id, cb) {
  // 请求处理
  let data = null
  try {
    request('/query?type=yunda&postid=433085175760261', 'GET')
      .then((result) => {
        // console.log(result)
        cb && cb(data)
      })
      .catch((error) => {
        console.error(error);
      });
    
  } catch (error) {
    cb && cb(data)
  }
}

// 创建文件
function createFile (path, data) {
  const obj = data || defaultObj
  let count = 0
  // 清空目录
  fsExtra.emptyDir(path)
    .then(() => {
      console.log(chalk.green(`\n${path}目录已经清空。`));
      // loading.text('文件创建中...')
      Object.keys(obj).forEach(key => {
        const widgetList = obj[key].widgetList || null
        // 创建页面文件夹
        fsExtra.ensureDir(`${path}/${key}`, err => {
          if (err) throw err;
          // console.log(chalk.green(`${key}文件夹创建成功。`));
          let code = ""
          if (widgetList) {
            code = getTemplate(widgetList)
          }
          const result = `<template>${code}</template>`
          const formattedCode = beautify.html(result, beautifierOpts.html);
          // 创建文件
          fsExtra.outputFile(`${path}/${key}/${key}.vue`, formattedCode, (err) => {
            if (err) throw err;
            // console.log(chalk.green(`${key}.vue文件创建成功。`));
            count++
            if (count === Object.keys(obj).length) {
              // 加载结束
              loading.succeed(chalk.bgYellowBright('所有文件创建完成\n'))
            }
          });
        });
        // fs.mkdir(`${path}/${key}`, (err) => {
        //   if (err) throw err;
        //   // console.log(chalk.green(`${key}文件夹创建成功。`));
        //   let code = ""
        //   if (widgetList) {
        //     code = getTemplate(widgetList)
        //   }
        //   const result = `<template>${code}</template>`
        //   const formattedCode = beautify.html(result, beautifierOpts.html);
        //   // 创建文件
        //   fs.writeFile(`${path}/${key}/${key}.vue`, formattedCode, (err) => {
        //     if (err) throw err;
        //     // console.log(chalk.green(`${key}.vue文件创建成功。`));
        //     count++
        //     if (count === Object.keys(obj).length) {
        //       // 加载结束
        //       loading.succeed(chalk.bgYellowBright('所有文件创建完成\n'))
        //     }
        //   });
        // });
      })
    })
    .catch(err => {
      console.log(chalk.bold.red(`${path}目录已经清空失败。`));
    });
}

