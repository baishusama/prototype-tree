# 说明

这是一个为了学习、理解、测试原型和原型链，而编写的一个可视化 demo 。

## DEMO

运行步骤：

1. 如果没有全局安装 browser-sync，那么先 `sudo npm i -g browser-sync`
2. 进入项目的根目录，启动 `browser-sync start --server --directory --files "**/*" --port 5000`
3. 访问关心的 html 文件，查看效果

### VanillaJS

访问 `http://localhost:5000/src/demos/vanillajs/index.html`，可以看到如图效果：

![vanillajs.html](http://ohz4k75du.bkt.clouddn.com/markdown/1532441477079.png)

## ImoNote

### ECMAScript

- `Object.prototype.toString` 用来相对准确地判断类型
- `Object.getOwnPropertyNames` 用来获取本地所有属性（包含可枚举与不可枚举的）
- `.hasOwnProperty(<propertyName>)` 用来判断是否是对象本地的属性
- `Object.getPrototypeOf` 用来获取对象的原型

### LoDash

- `_.forEachRight` 从右到左遍历，支持 `return false;` 提前结束遍历
- `_.isEqual` 先判断是否 `===`，否则如果参数像对象，那么进行深比较

  - [doc](https://lodash.com/docs/4.17.10#isEqual)
  - source codes:

    - [4.17.10/lodash.js#L11530](https://github.com/lodash/lodash/blob/4.17.10/lodash.js#L11530)
    - [`baseIsEqual`](https://github.com/lodash/lodash/blob/master/.internal/baseIsEqual.js)
    - [`baseIsEqualDeep`](https://github.com/lodash/lodash/blob/master/.internal/baseIsEqualDeep.js)

## TODO

- [ ] 添加 css 域编译器：.css => .scss
- [ ] JS 增强：ES6/TS（包含模块化）
