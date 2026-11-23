<template>
  <div class="demo-card">
    <div class="panel good">
      <p class="panel-title">正确写法 · toRefs 之后解构</p>
      <p>
        <code>state.count</code>：<span class="value-text">{{ state.count }}</span>
      </p>
      <p>
        解构出来的 <code>count</code>：<span class="value-text">{{ count }}</span>
        <span class="badge ok">联动中</span>
      </p>
      <p>
        解构出来的 <code>name</code>：<span class="value-text">{{ name }}</span>
      </p>
      <button class="btn" type="button" @click="add">count 加一</button>
      <button class="btn ghost" type="button" @click="addFromState">从 state 侧加一</button>
      <p class="hint" style="margin-top: 6px">
        两个按钮都能让两行数字一起变：toRefs 后的 ref 与原对象是双向联动的。
      </p>
    </div>

    <p class="hint ok">
      注意：toRefs 之后 <code>count</code> 是 ref，脚本里要写 <code>count.value</code>，
      模板里仍然直接写 <code>count</code>。
    </p>

    <div class="panel">
      <p class="panel-title muted">toRefs 与直接解构的差别</p>
      <table class="table">
        <thead>
          <tr>
            <th>写法</th>
            <th>count 是什么</th>
            <th>能否跟随源对象更新</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>const { count } = state</td>
            <td>普通数字（快照）</td>
            <td>不能</td>
          </tr>
          <tr>
            <td>const { count } = toRefs(state)</td>
            <td>指向 state.count 的 ref</td>
            <td>能</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="ToRefsDemo.vue" />
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import CodePanel from './CodePanel.vue'

const state = reactive({ count: 0, name: '小明' })

// 正确：toRefs 后每个属性都是 ref，解构仍保持响应式
const { count, name } = toRefs(state)

const add = () => {
  count.value += 1 // 通过 ref 修改，等价于 state.count += 1
}

const addFromState = () => {
  state.count += 1 // 改源对象，解构出来的 ref 同步更新
}
</script>
