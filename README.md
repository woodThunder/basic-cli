# fs-extra 文件处理
- fsExtra.pathExistsSync() 判断路径是否存在
- fsExtra.emptyDirSync() 清空目录
- fsExtra.ensureDirSync() 确保指定路径存在，如果不存在则创建该目录
- fs-extra.ensureFileSync() 确保指定文件存在，如果不存在则创建该文件。
- fsExtra.outputFileSync() 将数据写入指定文件。如果该文件不存在则创建该文件。

# rollup v3 打包工具
https://github.com/rollup/plugins 插件链接
- @rollup/plugin-terser 代码压缩
- @rollup/plugin-babel 代码兼容

# 版本管理
npm version命令支持以下参数来更新版本号：

- major：更新主版本号，例如1.0.0 -> 2.0.0。
- minor：更新次版本号，例如1.0.0 -> 1.1.0。
- patch：更新修订号，例如1.0.0 -> 1.0.1。
- premajor：更新主版本号，并添加预发布标识符，例如1.0.0 -> 2.0.0-0。
- preminor：更新次版本号，并添加预发布标识符，例如1.0.0 -> 1.1.0-0。
- prepatch：更新修订号，并添加预发布标识符，例如1.0.0 -> 1.0.1-0。
- prerelease：添加预发布标识符，例如1.0.0 -> 1.0.0-0。
- --no-git-tag-version：在更新版本号时，不创建新的Git标签。
- -m <commit message>或--message=<commit message>：指定Git提交的提交消息。
- --force-git-tag：在更新版本号时，强制创建新的Git标签。
- --git-tag-version：在更新版本号时，创建新的Git标签。
- --allow-same-version：允许新的版本号和当前版本号相同。
- --no-commit-hooks：在更新版本号时，不运行Git钩子。

# 打包

# 自动发布actions
## npm whoami
"npm whoami" 命令用于显示与当前身份验证的npm注册表相关联的用户名。如果您已经使用 "npm login" 命令登录了npm注册表，则运行 "npm whoami" 将显示您的用户名。如果您没有登录，则会提示您输入凭据以登录。
## npm adduser
npm adduser 命令用于在本地机器上进行身份验证并授权访问 npm 注册表，以便您可以使用 npm 发布和安装软件包。当您第一次使用 npm 时，或者您的身份验证凭据已过期或无效时，您需要运行 npm adduser 命令来进行身份验证。