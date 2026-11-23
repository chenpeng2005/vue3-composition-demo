<template>
  <div class="demo-card">
    <p class="hint ok">
      练习 3 要求：分别写出“解构 reactive 丢响应式”“reactive 整体赋值丢响应式”两个错误案例，
      并各给一种修复写法，能复现错误现象，说明失效原因与修复后的差异。
    </p>

    <p class="panel-title" style="margin: 6px 0 0">案例 A · 解构 reactive 丢响应式</p>
    <div class="grid-2">
      <div class="panel bad">
        <p class="panel-title">错误写法</p>
        <p>
          stateA.count：<span class="value-text">{{ stateA.count }}</span>
        </p>
        <p>
          <span class="badge bad">断联</span> 解构出的 brokenA：
          <span class="value-text" style="color: #b3261e">{{ brokenA }}</span>
        </p>
        <button class="btn danger" type="button" @click="addBroken">stateA.count 加一</button>
        <p class="hint" style="margin-top: 6px">
          <code>const { count: brokenA } = stateA</code> 取出的是解构那一刻的数字快照，
          之后怎么加都停在 0。
        </p>
      </div>

      <div class="panel good">
        <p class="panel-title">修复写法（toRefs）</p>
        <p>
          stateAFixed.count：<span class="value-text">{{ stateAFixed.count }}</span>
        </p>
        <p>
          <span class="badge ok">联动</span> 解构出的 fixedA：
          <span class="value-text">{{ fixedA }}</span>
        </p>
        <button class="btn" type="button" @click="addFixed">stateAFixed.count 加一</button>
        <p class="hint" style="margin-top: 6px">
          <code>const { count: fixedA } = toRefs(stateAFixed)</code> 得到的是指向原属性的
          ref，解构后仍然是活的引用。
        </p>
      </div>
    </div>

    <p class="panel-title" style="margin: 6px 0 0">案例 B · reactive 整体赋值丢响应式</p>
    <div class="grid-2">
      <div class="panel bad">
        <p class="panel-title">错误写法</p>
        <p>
          姓名：<span class="value-text" style="color: #b3261e">{{ userB.name }}</span>，年龄
          <span class="value-text" style="color: #b3261e">{{ userB.age }}</span>
        </p>
        <button class="btn danger" type="button" @click="brokenReplace">userB = 新对象</button>
        <button class="btn gray" type="button" @click="forceRender">触发重渲染</button>
        <p class="hint" style="margin-top: 6px">
          点“userB = 新对象”后界面不变（赋值没触发更新）；再点“触发重渲染”，数字会突然跳到
          李四 / 25，暴露出数据其实早就换了。重渲染次数：{{ tick }}
        </p>
      </div>

      <div class="panel good">
        <p class="panel-title">修复写法一：Object.assign 合并</p>
        <p>
          姓名：<span class="value-text">{{ userMerged.name }}</span>，年龄
          <span class="value-text">{{ userMerged.age }}</span>
        </p>
        <button class="btn" type="button" @click="mergeReplace">Object.assign 合并</button>
        <p class="panel-title" style="margin-top: 14px">修复写法二：改用 ref 包裹对象</p>
        <p>
          姓名：<span class="value-text">{{ profileRef.name }}</span>，年龄
          <span class="value-text">{{ profileRef.age }}</span>
        </p>
        <button class="btn ghost" type="button" @click="refReplace">整体替换 ref.value</button>
        <p class="hint" style="margin-top: 6px">
          两种修复都能正常刷新：前者写进的是原代理对象，后者 ref 会把新对象重新变成响应式。
        </p>
      </div>
    </div>

    <div class="panel">
      <p class="panel-title muted">失效原因与修复差异</p>
      <table class="table">
        <thead>
          <tr>
            <th>案例</th>
            <th>失效原因</th>
            <th>修复后的差异</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A 解构</td>
            <td>解构把属性值取成普通数字，脱离 Proxy，不再参与依赖收集</td>
            <td>toRefs 得到指向原属性的 ref，读写都会经过代理，模板恢复更新</td>
          </tr>
          <tr>
            <td>B 整体赋值</td>
            <td>变量指向了新的普通对象，旧代理被丢弃，模板仍盯着旧代理</td>
            <td>Object.assign 保留代理；改用 ref 则整体替换也能重新代理</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="Exercise3Broken.vue" />
  </div>
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
import CodePanel from './CodePanel.vue'

/* ---------- 案例 A ---------- */
const stateA = reactive({ count: 0 })
const { count: brokenA } = stateA // 错误：普通值快照

const stateAFixed = reactive({ count: 0 })
const { count: fixedA } = toRefs(stateAFixed) // 修复：指向原属性的 ref

const addBroken = () => {
  stateA.count += 1
}

const addFixed = () => {
  stateAFixed.count += 1
}

/* ---------- 案例 B ---------- */
let userB = reactive({ name: '张三', age: 20 }) // 故意用 let，才能复现“重新赋值”
const tick = ref(0)

function brokenReplace() {
  userB = { name: '李四', age: 25 } // 丢掉代理
}

function forceRender() {
  tick.value += 1
}

// 修复一：合并进原代理对象
const userMerged = reactive({ name: '张三', age: 20 })
const mergeReplace = () => Object.assign(userMerged, { name: '李四', age: 25 })

// 修复二：改用 ref 包裹对象，整体替换不丢响应式
const profileRef = ref({ name: '张三', age: 20 })
const refReplace = () => {
  profileRef.value = { name: '李四', age: 25 }
}
</script>
