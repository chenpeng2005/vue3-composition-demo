<template>
  <div class="demo-card">
    <div class="panel bad">
      <p class="panel-title">错误示范 · 解构 reactive 之后</p>
      <p>
        <code>state.count</code>（来自代理，会变）：
        <span class="value-text">{{ state.count }}</span>
      </p>
      <p>
        <code>count</code>（解构出来的普通值，永远不动）：
        <span class="value-text" style="color: #b3261e">{{ count }}</span>
        <span class="badge bad">已断联</span>
      </p>
      <button class="btn" type="button" @click="add">state.count 加一</button>
      <button class="btn gray" type="button" @click="resetDemo">重置</button>
      <p class="hint" style="margin-top: 6px">
        点击多次后，第一行一直涨，第二行固定是 0——这就是“解构丢响应式”最直观的现场。
      </p>
    </div>

    <p class="hint warn">
      原因：<code>const { count } = state</code> 只是把属性值“取出来”赋给一个新变量，
      取出来的是普通数字，与代理彻底断开。之后源对象再变化，这个普通变量不会跟着变，
      模板自然也不会更新。这不是 bug，而是 JavaScript 值传递的必然结果。
    </p>

    <div class="panel">
      <p class="panel-title muted">同一个组件里的两个变量</p>
      <table class="table">
        <thead>
          <tr>
            <th>变量</th>
            <th>本质</th>
            <th>是否响应式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>state</td>
            <td>reactive 返回的 Proxy</td>
            <td>是</td>
          </tr>
          <tr>
            <td>count</td>
            <td>解构时取出的普通数字</td>
            <td>否，永远是快照</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">修法见下一个页面：toRefs 之后解构出来的每一项都是 ref。</p>
    </div>

    <CodePanel file="DestructureWrong.vue" />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import CodePanel from './CodePanel.vue'

const state = reactive({ count: 0, name: '测试' })

// 错误：解构得到的是普通数值，脱离代理，失去响应式
const { count } = state

const add = () => {
  state.count += 1 // 源对象变了，但上面那个 count 永远停在 0
}

const resetDemo = () => {
  state.count = 0
}
</script>
