<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">toRef 只把 age 一个字段转成 ref</p>
      <p>
        <span class="value-text">{{ user.name }}</span> 今年
        <span class="value-text">{{ age }}</span> 岁
      </p>
      <button class="btn" type="button" @click="grow">长大一岁</button>
      <button class="btn ghost" type="button" @click="rename">换个人名</button>
      <p class="hint" style="margin-top: 6px">
        <code>age</code> 是 <code>toRef(user, 'age')</code> 得到的 ref，与
        <code>user.age</code> 双向联动；<code>name</code> 没有转，仍直接访问
        <code>user.name</code>。
      </p>
    </div>

    <div class="panel">
      <p class="panel-title muted">toRef 与 toRefs 的区别</p>
      <table class="table">
        <thead>
          <tr>
            <th>API</th>
            <th>作用范围</th>
            <th>语法</th>
            <th>什么时候用</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>toRef</td>
            <td>单个属性</td>
            <td>toRef(对象, '属性名')</td>
            <td>只需要取出一个字段</td>
          </tr>
          <tr>
            <td>toRefs</td>
            <td>整个对象</td>
            <td>toRefs(对象)</td>
            <td>需要解构出多个字段</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">
        拓展：toRef 也常用来给可能不存在的属性兜底，例如
        <code>toRef(props, 'title', '默认标题')</code>，第三个参数是缺省值。
      </p>
    </div>

    <CodePanel file="ToRefDemo.vue" />
  </div>
</template>

<script setup>
import { reactive, toRef } from 'vue'
import CodePanel from './CodePanel.vue'

const user = reactive({ name: '小李', age: 12 })

// 单独把 age 属性转成 ref，与原对象联动
const age = toRef(user, 'age')

const grow = () => {
  age.value += 1
}

const rename = () => {
  user.name = user.name === '小李' ? '小张' : '小李'
}
</script>
