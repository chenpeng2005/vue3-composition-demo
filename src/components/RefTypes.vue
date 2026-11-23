<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">三种类型的 ref 放在同一个组件里</p>
      <p>姓名：<span class="value-text">{{ name }}</span></p>
      <p>
        开关状态：
        <span class="value-text">{{ isOpen ? '已开启' : '已关闭' }}</span>
      </p>
      <p>
        用户：<span class="value-text">{{ userInfo.name }}</span
        >，年龄 <span class="value-text">{{ userInfo.age }}</span>
      </p>
      <button class="btn" type="button" @click="toggle">切换状态并长大一岁</button>
      <p class="hint" style="margin-top: 6px">
        模板里写 <code>userInfo.name</code>，不写 <code>userInfo.value.name</code>：编译器对顶层
        ref 做了自动解包；把 ref 当普通参数传进函数内部时，仍然要写 <code>.value</code>。
      </p>
    </div>

    <div class="panel">
      <p class="panel-title muted">类型与选型</p>
      <table class="table">
        <thead>
          <tr>
            <th>数据类型</th>
            <th>能否被 Proxy 代理</th>
            <th>推荐写法</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>数字、字符串、布尔</td>
            <td>不能</td>
            <td>必须用 ref</td>
          </tr>
          <tr>
            <td>对象、数组</td>
            <td>能（reactive）</td>
            <td>ref 或 reactive 都行；需要整体替换就用 ref</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodePanel file="RefTypes.vue" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodePanel from './CodePanel.vue'

const name = ref('小明')
const isOpen = ref(false)

// ref 也可以包裹对象：整体替换不会丢响应式
const userInfo = ref({ name: '小红', age: 16 })

const toggle = () => {
  isOpen.value = !isOpen.value
  userInfo.value.age += 1 // 修改对象内部属性，模板会自动更新
}
</script>
