<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">入门案例 · 点我改文案</p>

      <!-- 手册第 3.2 节原样内容开始 -->
      <div class="box">
        <h3>{{ msg }}</h3>
        <button class="btn" @click="changeMsg">点我改文案</button>
      </div>
      <!-- 手册第 3.2 节原样内容结束 -->

      <p class="hint" style="margin-top: 12px">
        这个组件的脚本与模板照手册第 3.2 节原样搬过来，只在按钮上补了统一样式类
        <code>btn</code>，外面套了一层页面壳（标题、说明、下方源码面板）。脚本里读写 ref 必须写
        <code>msg.value</code>，模板里由编译器自动解包，直接写 <code>msg</code>。
      </p>
    </div>

    <CodePanel file="FirstDemo.vue" />
  </div>
</template>

<script setup>
// 1. 导入 Vue 的内置 API
import { ref } from 'vue'
import CodePanel from './CodePanel.vue'

// 2. 定义响应式数据
const msg = ref('Hello Vue3 组合式 API')

// 3. 定义函数，脚本中读写 ref 必须带 .value
function changeMsg() {
  msg.value = '我学会 script setup 啦'
}
</script>

<style scoped>
/* scoped：样式只作用于当前组件，不会污染其他组件 */
.box {
  padding: 12px;
  border: 1px solid #cccccc;
  border-radius: 6px;
}
</style>
