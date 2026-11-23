<template>
  <div class="demo-card">
    <p class="hint ok">
      练习 1 要求：用 reactive 写一个包含账号、密码、昵称的表单，再用 toRefs 解构出三个字段单独绑定；
      三个字段都能双向绑定，修改任一字段，页面与源对象同步变化。
    </p>

    <div class="panel">
      <p class="panel-title">toRefs 解构后单独绑定三个字段</p>
      <label class="field">
        <span>账号</span>
        <input v-model="username" type="text" placeholder="请输入账号" />
      </label>
      <label class="field">
        <span>密码</span>
        <input v-model="password" type="password" placeholder="请输入密码" />
      </label>
      <label class="field">
        <span>昵称</span>
        <input v-model="nickname" type="text" placeholder="请输入昵称" />
      </label>
      <button class="btn ghost" type="button" @click="changeFromSource">
        从源对象侧改账号
      </button>
      <button class="btn gray" type="button" @click="clearAll">清空</button>
    </div>

    <div class="grid-2">
      <div class="panel">
        <p class="panel-title muted">三个 ref 当前的值</p>
        <p>username：<span class="value-text">{{ username || '（空）' }}</span></p>
        <p>password：<span class="value-text">{{ password || '（空）' }}</span></p>
        <p>nickname：<span class="value-text">{{ nickname || '（空）' }}</span></p>
      </div>
      <div class="panel">
        <p class="panel-title muted">源对象 form 的当前值</p>
        <pre class="console">{{ formText }}</pre>
      </div>
    </div>

    <p class="hint">
      两边永远一致：因为 <code>username</code> 等是 <code>toRefs(form)</code> 得到的 ref，
      与 <code>form</code> 上的同名属性指向同一份数据。改 input 就是改
      <code>username.value</code>，等价于改 <code>form.username</code>；反过来从
      <code>form</code> 侧改，输入框也会跟着变。
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
            <td>三个字段都能双向绑定</td>
            <td>三个 input 分别 v-model 到 toRefs 解构出的 ref</td>
          </tr>
          <tr>
            <td>修改任一字段，页面与源对象同步</td>
            <td>右侧实时打印 form 的 JSON 快照</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="Exercise1Form.vue" />
  </div>
</template>

<script setup>
import { reactive, toRefs, computed } from 'vue'
import CodePanel from './CodePanel.vue'

const form = reactive({
  username: '',
  password: '',
  nickname: ''
})

// toRefs 之后每一项都是 ref，解构出来仍然与源对象联动
const { username, password, nickname } = toRefs(form)

const formText = computed(() => JSON.stringify(form, null, 2))

// 从源对象侧改，验证是双向联动
function changeFromSource() {
  form.username = 'from_source_' + Math.random().toString(36).slice(2, 6)
}

function clearAll() {
  form.username = ''
  form.password = ''
  form.nickname = ''
}
</script>

<style scoped>
.field {
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #5b6b6b;
}

.field input {
  margin: 0;
}
</style>
