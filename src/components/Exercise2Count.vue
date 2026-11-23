<template>
  <div class="demo-card">
    <p class="hint ok">
      练习 2 要求：封装组合式函数 <code>useCount(initial)</code>，内部用 ref 保存计数，提供
      inc、dec、reset 三个方法；组件里导入即可使用，多次调用互不干扰。
    </p>

    <div class="grid-2">
      <div class="panel">
        <p class="panel-title">实例 A · useCount(0)</p>
        <p>
          计数：<span class="value-text">{{ countA }}</span>
        </p>
        <button class="btn" type="button" @click="incA">inc</button>
        <button class="btn ghost" type="button" @click="decA">dec</button>
        <button class="btn gray" type="button" @click="resetA">reset</button>
      </div>

      <div class="panel">
        <p class="panel-title">实例 B · useCount(10)</p>
        <p>
          计数：<span class="value-text">{{ countB }}</span>
        </p>
        <button class="btn" type="button" @click="incB">inc</button>
        <button class="btn ghost" type="button" @click="decB">dec</button>
        <button class="btn gray" type="button" @click="resetB">reset</button>
      </div>
    </div>

    <p class="hint">
      反复点击任意一边，另一边不会跟着变：每次调用 <code>useCount</code> 都会
      <code>ref(initial)</code> 出一个新的 count，各自独立；reset 会回到自己的初始值
      （A 回 0，B 回 10）。
    </p>

    <div class="panel">
      <p class="panel-title muted">完成标准自查</p>
      <table class="table">
        <thead>
          <tr>
            <th>完成标准</th>
            <th>本页对应实现</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>组件中导入即可使用</td>
            <td>import { useCount } from '../composables/useCount.js'</td>
          </tr>
          <tr>
            <td>多次调用互不干扰，计数各自独立</td>
            <td>页面同时挂两个实例（初值 0 与 10），互不影响</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="useCount.js" />
    <CodePanel file="Exercise2Count.vue" />
  </div>
</template>

<script setup>
import { useCount } from '../composables/useCount.js'
import CodePanel from './CodePanel.vue'

// 两次调用 = 两套独立的 count
const { count: countA, inc: incA, dec: decA, reset: resetA } = useCount(0)
const { count: countB, inc: incB, dec: decB, reset: resetB } = useCount(10)
</script>
