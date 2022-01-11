# Ouroboros - 文件排序

<a href="https://sm.ms/image/PNtcf2IhwuzioXT" target="_blank"><img src="https://s2.loli.net/2022/01/09/PNtcf2IhwuzioXT.png" width = "300" height = "300" ></a>

## 功能

依据文件后缀名和文件名称来对所有 group 的文件进行排序, 没有文件后缀的默认后缀为 `"ZZZ"` .  
`首先按照后缀排序, 后缀相同的排在一起, 内部按照文件名排序.`

## 使用

安装插件后, `ctrl + shift + p` 输入 `obs`

## 效果

![obs.gif](https://s2.loli.net/2022/01/09/tQEVYIJqFwjairg.gif)

## 版本控制

`0.0.3:` 添加 c, c++ 头文件和源文件排序后挨在一起的效果  
`0.0.2:` 更新 readme  
`0.0.1:` 勉强能用

## bug

目前使用的 vscode api 根据后缀会判断打开的不是一个 editor, 比如打开 gif 文件, 导致返回 undefined, 不符合预期, `尝试更换其他api`
