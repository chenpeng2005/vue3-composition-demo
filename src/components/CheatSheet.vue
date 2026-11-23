<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">日常三条命令（手册 2.6）</p>
      <table class="table">
        <thead>
          <tr>
            <th>命令</th>
            <th>用途</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>npm run dev</td>
            <td>启动本地服务用于写代码，改文件自动刷新</td>
          </tr>
          <tr>
            <td>npm run build</td>
            <td>打包生成可上线的 dist 目录</td>
          </tr>
          <tr>
            <td>npm run preview</td>
            <td>在本地预览打包产物</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="panel">
      <p class="panel-title">初学高频报错（手册 2.6）</p>
      <table class="table">
        <thead>
          <tr>
            <th>现象</th>
            <th>原因</th>
            <th>处理办法</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>提示 node 不是内部或外部命令</td>
            <td>未安装 Node.js 或未加入 PATH</td>
            <td>重装 LTS 版本并勾选 Add to PATH</td>
          </tr>
          <tr>
            <td>npm install 长时间卡住或超时</td>
            <td>默认源在国内访问较慢</td>
            <td>切换镜像：npm config set registry https://registry.npmmirror.com</td>
          </tr>
          <tr>
            <td>创建项目时报项目名非法</td>
            <td>名称含中文、空格或大写</td>
            <td>只用小写英文与连字符重新创建</td>
          </tr>
          <tr>
            <td>npm run dev 后浏览器打不开</td>
            <td>端口被占用或服务未启动</td>
            <td>看终端是否报 EADDRINUSE，在 vite.config.js 中改 server.port</td>
          </tr>
          <tr>
            <td>保存代码页面不更新</td>
            <td>存在语法错误导致编译失败</td>
            <td>看终端与浏览器控制台的红色报错并修正</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="panel">
      <p class="panel-title">常见错误速查（手册第 6 部分）</p>
      <table class="table">
        <thead>
          <tr>
            <th>现象</th>
            <th>根本原因</th>
            <th>正确做法</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>模板里数字不变</td>
            <td>解构了 reactive 对象</td>
            <td>改用 toRefs，或直接访问 state.xxx</td>
          </tr>
          <tr>
            <td>ref 改了没反应</td>
            <td>脚本中漏写 .value</td>
            <td>读写一律 score.value</td>
          </tr>
          <tr>
            <td>整体替换后页面不更新</td>
            <td>reactive 被赋了新对象</td>
            <td>逐字段赋值、Object.assign，或改用 ref</td>
          </tr>
          <tr>
            <td>控制台报 ref 是对象</td>
            <td>把 ref 当普通值参与运算</td>
            <td>取值时显式写 .value</td>
          </tr>
          <tr>
            <td>定时器越跑越多</td>
            <td>组件卸载未清理副作用</td>
            <td>onUnmounted 中 clearInterval</td>
          </tr>
          <tr>
            <td>点击按钮立刻执行了一次</td>
            <td>写成 @click="fn()"</td>
            <td>写成 @click="fn"，传函数引用</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="panel">
      <p class="panel-title">两课知识对照（手册第 7 部分）</p>
      <table class="table">
        <thead>
          <tr>
            <th>对比项</th>
            <th>ref</th>
            <th>reactive</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>适用类型</td>
            <td>任意类型，基础类型必选</td>
            <td>仅对象与数组</td>
          </tr>
          <tr>
            <td>访问方式</td>
            <td>脚本 .value，模板自动解包</td>
            <td>直接访问属性</td>
          </tr>
          <tr>
            <td>整体替换</td>
            <td>支持，不会丢响应式</td>
            <td>不支持，会断开代理</td>
          </tr>
          <tr>
            <td>解构</td>
            <td>解构即失去响应式（除非 toRef/toRefs）</td>
            <td>解构即失去响应式，需 toRefs</td>
          </tr>
          <tr>
            <td>典型场景</td>
            <td>计数器、开关、异步结果、需要替换的对象</td>
            <td>表单、配置对象、结构固定的聚合数据</td>
          </tr>
        </tbody>
      </table>
      <p class="hint" style="margin-top: 10px">
        选型口诀：<strong>会被整体换成另一个对象，就用 ref；只是改字段，用 reactive 更清爽。</strong>
      </p>
    </div>

    <div class="grid-2">
      <div class="panel">
        <p class="panel-title">环境搭建四条（手册 2.8）</p>
        <ol class="rule-list">
          <li>先确认 Node 版本，再创建项目，顺序不能颠倒</li>
          <li>创建后必须进入项目目录执行 npm install，否则依赖缺失</li>
          <li>组件统一放 src/components，并在父组件中 import 使用</li>
          <li>开发只用 npm run dev，打包上线才用 npm run build</li>
        </ol>
      </div>

      <div class="panel">
        <p class="panel-title">入门四条规则（手册 3.4）</p>
        <ol class="rule-list">
          <li>
            script setup 是编译期语法糖，不需要 export default，也不需把变量 return 出去
          </li>
          <li>脚本内部读写 ref 必须 .value，模板由编译器自动解包，直接写变量名</li>
          <li>组件内定义的状态都是“每次实例一份”，不会在实例之间共享</li>
          <li>style 加 scoped 只影响当前组件，全局样式另建文件</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
// 本页只做静态速查，无响应式逻辑
</script>

<style scoped>
.rule-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.9;
  color: #3f5151;
}

.rule-list li {
  margin-bottom: 6px;
}
</style>
