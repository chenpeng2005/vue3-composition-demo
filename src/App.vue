<template>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <h1>Vue3 组合式开发</h1>
        <p>第 1-2 课 · 案例与练习</p>
      </div>

      <nav class="nav">
        <div v-for="group in groups" :key="group.title" class="nav-group">
          <p class="nav-group-title">{{ group.title }}</p>
          <button
            v-for="item in group.items"
            :key="item.key"
            type="button"
            class="nav-item"
            :class="{ active: current.key === item.key }"
            @click="current = item"
          >
            <span class="nav-index">{{ item.no }}</span>
            <span>{{ item.title }}</span>
          </button>
        </div>
      </nav>

      <p class="sidebar-tip">
        全部示例使用 &lt;script setup&gt; 与组合式 API，不写选项式、不使用 this。
      </p>
    </aside>

    <main class="main">
      <header class="page-head">
        <p class="crumb">{{ current.group }} / {{ current.title }}</p>
        <h2>{{ current.title }}</h2>
        <p class="intro">{{ current.intro }}</p>
      </header>

      <section class="demo">
        <component :is="current.component" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { markRaw, ref } from 'vue'

import FirstDemo from './components/FirstDemo.vue'
import CheatSheet from './components/CheatSheet.vue'
import CountCompare from './components/CountCompare.vue'
import RefTypes from './components/RefTypes.vue'
import RefValueDemo from './components/RefValueDemo.vue'
import TimerDemo from './components/TimerDemo.vue'
import ReactiveForm from './components/ReactiveForm.vue'
import DestructureWrong from './components/DestructureWrong.vue'
import ToRefsDemo from './components/ToRefsDemo.vue'
import ToRefDemo from './components/ToRefDemo.vue'
import ReactiveReplace from './components/ReactiveReplace.vue'
import ProxyPrinciple from './components/ProxyPrinciple.vue'
import Exercise1Form from './components/Exercise1Form.vue'
import Exercise2Count from './components/Exercise2Count.vue'
import Exercise3Broken from './components/Exercise3Broken.vue'

const groups = [
  {
    title: '起步',
    items: [
      {
        key: 'first',
        no: '00',
        title: '第一个组合式组件',
        group: '起步',
        intro: '手册第 3 部分的入门案例：template + script setup + style scoped，点击按钮改文案。',
        component: markRaw(FirstDemo)
      },
      {
        key: 'cheat',
        no: '01',
        title: '常见错误与选型速查',
        group: '起步',
        intro: '把手册第 6、7 部分的两张表搬进页面，调试时按“现象”一列对照查找。',
        component: markRaw(CheatSheet)
      }
    ]
  },
  {
    title: '第 1 课 · ref',
    items: [
      {
        key: 'count',
        no: '02',
        title: '计数器：组合式写法',
        group: '第 1 课',
        intro: '手册第 4.1 节：state 与行为写在一起，注意 @click 传函数引用而不是函数调用。',
        component: markRaw(CountCompare)
      },
      {
        key: 'refTypes',
        no: '03',
        title: 'ref 能包哪些数据',
        group: '第 1 课',
        intro: '手册第 4.2 节：字符串、布尔、对象三种 ref，模板访问对象属性时不用写 .value。',
        component: markRaw(RefTypes)
      },
      {
        key: 'refValue',
        no: '04',
        title: '.value 与模板自动解包',
        group: '第 1 课',
        intro: '手册第 4.3 节：脚本必须 .value，模板自动解包，本质是 RefImpl 包装对象。',
        component: markRaw(RefValueDemo)
      },
      {
        key: 'timer',
        no: '05',
        title: '定时器与异步里的 ref',
        group: '第 1 课',
        intro: '手册第 4.4 节：倒计时在 onUnmounted 里清理，异步请求用 finally 收回 loading。',
        component: markRaw(TimerDemo)
      }
    ]
  },
  {
    title: '第 2 课 · reactive',
    items: [
      {
        key: 'form',
        no: '06',
        title: 'reactive 写登录表单',
        group: '第 2 课',
        intro: '手册第 5.1 节：字段固定的表单用 reactive，v-model 直接绑定属性，不加 .value。',
        component: markRaw(ReactiveForm)
      },
      {
        key: 'destructure',
        no: '07',
        title: '解构丢响应式（错误示范）',
        group: '第 2 课',
        intro: '手册第 5.2 节：解构取出的是普通值，源对象再变，这一行永远停在 0。',
        component: markRaw(DestructureWrong)
      },
      {
        key: 'torefs',
        no: '08',
        title: 'toRefs 修复解构',
        group: '第 2 课',
        intro: '手册第 5.3 节：toRefs 后每个属性都是 ref，解构仍然联动，脚本里记得 .value。',
        component: markRaw(ToRefsDemo)
      },
      {
        key: 'toref',
        no: '09',
        title: 'toRef 只取一个字段',
        group: '第 2 课',
        intro: '手册第 5.4 节：只把一个属性转成 ref，避免把无关字段也包一遍。',
        component: markRaw(ToRefDemo)
      },
      {
        key: 'replace',
        no: '10',
        title: 'reactive 整体替换的坑',
        group: '第 2 课',
        intro: '手册第 5.5 节：逐字段赋值、Object.assign、改用 ref 三种方案对照。',
        component: markRaw(ReactiveReplace)
      },
      {
        key: 'proxy',
        no: '11',
        title: 'Proxy 拦截原理',
        group: '第 2 课',
        intro: '手册第 5.6 节：手写 Proxy 观察 get/set，理解 track 与 trigger 的链路。',
        component: markRaw(ProxyPrinciple)
      }
    ]
  },
  {
    title: '课后练习',
    items: [
      {
        key: 'ex1',
        no: '12',
        title: '练习 1：表单 + toRefs',
        group: '课后练习',
        intro: '账号、密码、昵称三个字段用 toRefs 解构后单独绑定，改任一字段页面与源对象同步。',
        component: markRaw(Exercise1Form)
      },
      {
        key: 'ex2',
        no: '13',
        title: '练习 2：useCount 组合式函数',
        group: '课后练习',
        intro: '封装 useCount(initial)，提供 inc、dec、reset，多次调用互不干扰。',
        component: markRaw(Exercise2Count)
      },
      {
        key: 'ex3',
        no: '14',
        title: '练习 3：两类失效与修复',
        group: '课后练习',
        intro: '解构丢响应式、整体赋值丢响应式，各复现一次并给出修复写法。',
        component: markRaw(Exercise3Broken)
      }
    ]
  }
]

const current = ref(groups[0].items[0])
</script>
