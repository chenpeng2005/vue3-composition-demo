<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">登录表单 · 字段固定，用 reactive 最顺手</p>
      <input v-model="form.username" type="text" placeholder="请输入账号" />
      <input v-model="form.password" type="password" placeholder="请输入密码" />
      <p>账号：<span class="value-text">{{ form.username || '（空）' }}</span></p>
      <p>密码长度：<span class="value-text">{{ form.password.length }}</span></p>
      <p class="hint">
        <code>v-model</code> 直接绑定 <code>form.username</code>，不需要也不允许加
        <code>.value</code>。reactive 返回的对象就是代理，属性读写都会被拦截。
      </p>
      <button class="btn ghost" type="button" @click="fillDemo">填入示例账号</button>
      <button class="btn gray" type="button" @click="clearForm">清空</button>
    </div>

    <div class="panel">
      <p class="panel-title muted">提交时整体传给接口（结构固定正是 reactive 的强项）</p>
      <pre class="console">{{ submitted || '// 还没有提交' }}</pre>
      <button class="btn" type="button" @click="submit">模拟提交</button>
    </div>

    <CodePanel file="ReactiveForm.vue" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import CodePanel from './CodePanel.vue'

const form = reactive({
  username: '',
  password: ''
})

const submitted = ref('')

function fillDemo() {
  form.username = 'vue_student'
  form.password = 'vue3-composition'
}

function clearForm() {
  form.username = ''
  form.password = ''
}

function submit() {
  // 逐字段读取，整体打包成接口需要的结构
  submitted.value = JSON.stringify({ ...form }, null, 2)
}
</script>
