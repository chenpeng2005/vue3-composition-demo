# Vue3 组合式开发 · 第 1-2 课案例工程

把《Vue3 组合式开发学习指导手册》第 1、2 课的全部案例和 3 道课后练习，做成了一套可以直接点开看的页面。
全部代码使用 `<script setup>` 与组合式 API，没有选项式写法，也没有 `this`。

## 快速开始

```bash
cd C:\Users\1\Doubao\chats\2026-11-18\new-chat\vue3-composition-demo
npm install          # 已经装好，换电脑或删了 node_modules 才需要再执行
npm run dev
```

终端会输出 `http://localhost:5173/`，复制到浏览器打开即可。改任意 `.vue` 文件保存后页面自动刷新。

其他命令：`npm run build` 打包到 `dist`，`npm run preview` 本地预览打包产物。

## 目录结构

```
vue3-composition-demo/
├── index.html              页面模板
├── vite.config.js          Vite 配置（端口 5173）
├── package.json            依赖与命令脚本
├── src/
│   ├── main.js             入口：createApp + mount
│   ├── App.vue             根组件：左侧导航 + 右侧演示区
│   ├── assets/styles.css   全局样式
│   ├── composables/
│   │   └── useCount.js     练习 2 的组合式函数
│   └── components/         全部演示组件（共 15 个页面）
```

约定与手册一致：自己写的组件都放在 `src/components`，新组件必须在父组件里 `import` 才会出现在页面上，`main.js` 一般不改。

## 页面与手册章节对照

| 侧边栏 | 组件文件 | 对应手册 | 看点 |
| --- | --- | --- | --- |
| 00 第一个组合式组件 | `FirstDemo.vue` | 3.1–3.4 | 点击按钮改文案，`msg.value` vs 模板 `msg` |
| 01 常见错误与选型速查 | `CheatSheet.vue` | 2.6、2.8、3.4、6、7 | 命令与报错表、错误速查表、ref/reactive 对照表、两侧规则清单 |
| 02 计数器：组合式写法 | `CountCompare.vue` | 4.1 | `@click="add"` 与 `@click="add()"` 的区别 |
| 03 ref 能包哪些数据 | `RefTypes.vue` | 4.2 | 字符串 / 布尔 / 对象三种 ref |
| 04 .value 与模板解包 | `RefValueDemo.vue` | 4.3 | 同屏显示两种取值方式与 RefImpl 结构 |
| 05 定时器与异步里的 ref | `TimerDemo.vue` | 4.4 | `onUnmounted` 清理定时器、`finally` 收回 loading |
| 06 reactive 写登录表单 | `ReactiveForm.vue` | 5.1 | `v-model` 直接绑属性，不加 `.value` |
| 07 解构丢响应式（错误） | `DestructureWrong.vue` | 5.2 | 第一行会涨、第二行永远 0 |
| 08 toRefs 修复解构 | `ToRefsDemo.vue` | 5.3 | 双向联动，脚本 `.value`、模板直接写 |
| 09 toRef 只取一个字段 | `ToRefDemo.vue` | 5.4 | 只有 `age` 转成 ref |
| 10 整体替换的坑 | `ReactiveReplace.vue` | 5.5 | 逐字段、`Object.assign`、`ref` 三种方案，附错误示范 |
| 11 Proxy 拦截原理 | `ProxyPrinciple.vue` | 5.6 | 手写 Proxy，日志里看 get/set |
| 12 练习 1：表单 + toRefs | `Exercise1Form.vue` | 练习 1 | 三个字段单独绑定，右侧实时打印源对象 |
| 13 练习 2：useCount | `Exercise2Count.vue` | 练习 2 | 两个实例（0 与 10）互不干扰 |
| 14 练习 3：两类失效与修复 | `Exercise3Broken.vue` | 练习 3 | 错误 / 修复左右对照，含“赋值不刷新、重渲染才跳变”的实验 |

每个演示页底部都有「查看源码」按钮，展开后显示的就是该页的真实 `.vue` 源码（用 Vite 的 `?raw` 导入），方便对照页面效果和代码。

## 与手册的一致性

逐条核对结果见 **《手册一致性核对报告.md》**。结论：手册第 1–8 部分的核心代码与结论全部覆盖，本轮把 4 处偏离改回了手册原样——

1. 入门案例按 3.2 节：按钮“点我改文案”，补回模板与 scoped 注释，样式值不额外改；
2. 4.3 补上真实的 `console.log('ref 对象本身：', score)` 与 `console.log('真实数值：', score.value)`；
3. 5.6 的 Proxy get/set 补上真实 `console.log`；
4. 4.4 定时器改为组件挂载即开始，与手册 `setInterval` 直接写在 setup 一致。

唯一的结构差异是 `App.vue`：手册只挂一个 `FirstDemo`，本项目改成“左侧导航 + 右侧动态组件”，把 15 个页面并列。它等价于把手册的单组件扩展成多个互不干扰的组件；单组件挂载写法在任何页面组件的 `<script setup>` 里都照常可用。手册 2.7 的 TypeScript 模板（`--template vue-ts`）未包含在本项目中。

## 三个练习的实现要点

**练习 1（`Exercise1Form.vue`）**

```js
const form = reactive({ username: '', password: '', nickname: '' })
const { username, password, nickname } = toRefs(form)   // 解构后仍是 ref
```

三个 `input` 分别 `v-model` 到解构出来的 ref；页面右侧实时打印 `form` 的 JSON，用来证明“输入框改一点，源对象立刻同步”，点「从源对象侧改账号」还能验证反向同步。

**练习 2（`composables/useCount.js` + `Exercise2Count.vue`）**

`useCount(initial)` 内部 `ref(initial)`，返回 `{ count, inc, dec, reset }`。练习页同时调用两次（初值 0 和 10），因为每次调用都新建一套 `count`，所以点 A 不影响 B，`reset` 也各回各的初值。

**练习 3（`Exercise3Broken.vue`）**

- 案例 A：`const { count } = state` → 解构出的是数字快照；修复用 `toRefs(state)`。
- 案例 B：`userB = { ... }` 丢掉代理 → 界面不刷新；点「触发重渲染」后数值突然跳变，正是这个坑的真实表现。修复二选一：`Object.assign(userB, {...})` 写回原代理，或改用 `ref` 包对象并整体替换 `profile.value`。

## 环境要求与常见报错

- Node.js 20 及以上，推荐 26 LTS（本机已验证 v26.13.1 / npm 11.20.0），Vue 3.5、Vite 6。
- `npm install` 卡住：`npm config set registry https://registry.npmmirror.com`（本机已设置）。
- 端口被占用：改 `vite.config.js` 里的 `server.port`，或启动时加 `npm run dev -- --port 5174`。
- 页面空白：先看终端有没有红色编译错误，再检查 `import` 路径大小写是否与文件名一致。
- npm 11 装依赖时提示 `esbuild@0.25.12 (postinstall: node install.js)` 未批准：这是 npm 新增的安装脚本安全机制，本项目已在 `package.json` 的 `allowScripts` 里批准过；以后升级依赖导致 esbuild 版本变化时，重新执行 `npm install-scripts approve esbuild` 即可。不批准也能跑，因为 esbuild 的平台二进制是随依赖一起下发的。

## 验证情况

- `npm run build` 通过（47 个模块，产物 157.91 kB / gzip 51.15 kB），Node v26.13.1 下验证通过。
- 15 个页面逐个渲染、逐个点击页面内全部按钮，无运行时报错。
- 手册第 3–8 部分共 **37 条断言全部通过**，逐条结果见 **《分步执行记录.md》**。
- 可复现验收：`npm install --no-save jsdom` → `npm run build` → `node tools/验收脚本.mjs`（退出码 0 即全部通过）。

> 注：jsdom 环境需补上 `Document` / `ShadowRoot` 两个全局构造器，否则 Vue 的 `v-model` 更新会报 `Document is not defined`；脚本里已处理，这是测试环境问题，浏览器中不受影响。

