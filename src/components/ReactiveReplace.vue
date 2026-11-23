<template>
  <div class="demo-card">
    <div class="panel good">
      <p class="panel-title">三种正确做法 · 都不会丢响应式</p>
      <p>
        reactive 的 user：<span class="value-text">{{ user.name }}</span> /
        <span class="value-text">{{ user.age }}</span> 岁
      </p>
      <button class="btn" type="button" @click="resetOne">方案一：逐字段赋值</button>
      <button class="btn" type="button" @click="resetTwo">方案二：Object.assign</button>
      <p>
        ref 包裹的 profile：<span class="value-text">{{ profile.name }}</span> /
        <span class="value-text">{{ profile.age }}</span> 岁
      </p>
      <button class="btn" type="button" @click="resetThree">方案三：ref 整体替换</button>
      <p class="hint" style="margin-top: 6px">
        前两个按钮改的是同一个代理对象的字段；第三个按钮换的是
        <code>profile.value</code> 指向的新对象，ref 会把新对象重新变成响应式。
      </p>
    </div>

    <div class="panel bad">
      <p class="panel-title">错误示范 · 直接给 reactive 变量赋新对象</p>
      <p>
        姓名：<span class="value-text" style="color: #b3261e">{{ userBroken.name }}</span>，年龄
        <span class="value-text" style="color: #b3261e">{{ userBroken.age }}</span>
        <span class="badge bad">界面卡住</span>
      </p>
      <button class="btn danger" type="button" @click="brokenReplace">userBroken = 新对象</button>
      <button class="btn gray" type="button" @click="forceRender">触发一次重渲染</button>
      <p class="hint" style="margin-top: 6px">
        点第一个按钮，界面一动不动（数据其实已经换了，但没有触发更新）；再点第二个按钮，
        数字会突然跳到新值——这就是最容易被误判为“偶发 bug”的现象。
        <br />
        重渲染次数：{{ tick }}（仅用于强制刷新，观察上面的变化）
      </p>
    </div>

    <p class="hint warn">
      原理：reactive 的响应式来自它返回的那个 Proxy。执行
      <code>userBroken = { ... }</code> 后，变量指向一个全新的普通对象，原来的代理被丢弃，
      模板还盯着旧代理，所以界面不再更新。
    </p>

    <div class="panel">
      <p class="panel-title muted">怎么选</p>
      <table class="table">
        <thead>
          <tr>
            <th>数据会不会被整体换成另一个对象</th>
            <th>推荐</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>会（如重置、接口回填整个表单）</td>
            <td>用 ref 包裹对象</td>
          </tr>
          <tr>
            <td>不会，只改其中某些字段</td>
            <td>用 reactive，写起来更清爽</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="ReactiveReplace.vue" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import CodePanel from './CodePanel.vue'

/* ---------- 正确写法 ---------- */
const user = reactive({ name: '张三', age: 20 })
const profile = ref({ name: '王五', age: 30 })

// 方案一：逐字段赋值（最稳妥，字段少时首选）
function resetOne() {
  user.name = '张三'
  user.age = 20
}

// 方案二：Object.assign 把新字段合并进原代理对象
function resetTwo() {
  Object.assign(user, { name: '李四', age: 25 })
}

// 方案三：需要整体替换时，改用 ref 包裹对象
function resetThree() {
  profile.value = { name: '王五', age: 30 }
}

/* ---------- 错误示范 ---------- */
// 这里故意用 let：const 声明不允许重新赋值，就复现不了这个坑
let userBroken = reactive({ name: '张三', age: 20 })
const tick = ref(0)

function brokenReplace() {
  userBroken = { name: '李四', age: 25 } // 变量换成了普通对象，代理被丢弃
}

function forceRender() {
  tick.value += 1 // 只有其他响应式数据变化，才会顺带把界面刷一遍
}
</script>
