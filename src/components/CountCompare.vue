<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">组合式计数器 · 状态与行为写在一起</p>
      <p>
        当前计数：<span class="value-text">{{ count }}</span>
      </p>
      <button class="btn" type="button" @click="add">加一</button>
      <button class="btn ghost" type="button" @click="reduce">减一</button>
      <p class="hint" style="margin-top: 6px">
        模板里直接写 <code>count</code>，脚本里改的是 <code>count.value</code>。
      </p>
    </div>

    <p class="hint warn">
      注意：按钮上的 <code>@click="add"</code> 传的是函数引用本身，不能写成
      <code>@click="add()"</code>，否则页面渲染时就会立即执行一次，点一下反而变成加二。
    </p>

    <div class="panel">
      <p class="panel-title muted">选项式写法长这样（仅作对比，本项目不采用）</p>
      <table class="table">
        <thead>
          <tr>
            <th>对比项</th>
            <th>组合式（本页）</th>
            <th>选项式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>状态</td>
            <td>const count = ref(0)</td>
            <td>data() { return { count: 0 } }</td>
          </tr>
          <tr>
            <td>方法</td>
            <td>const add = () => count.value++</td>
            <td>methods: { add() { this.count++ } }</td>
          </tr>
          <tr>
            <td>访问 this</td>
            <td>没有 this</td>
            <td>依赖 this</td>
          </tr>
          <tr>
            <td>逻辑复用</td>
            <td>组合式函数（composables）</td>
            <td>mixin</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="CountCompare.vue" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodePanel from './CodePanel.vue'

const count = ref(0)

const add = () => count.value++
const reduce = () => count.value--
</script>
