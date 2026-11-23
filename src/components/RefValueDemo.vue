<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">同一份数据，两种访问方式</p>
      <!-- 模板：自动解包，直接写 score -->
      <p>
        模板里（自动解包）：<span class="value-text">{{ score }}</span>
      </p>
      <p>脚本里（必须 .value）：<span class="value-text">{{ scriptValue }}</span></p>
      <p class="hint">
        上面两行显示的数字一样，因为模板中的 <code>score</code> 被编译器替换成了
        <code>score.value</code>。反过来说，模板里千万不能写 <code>score.value</code>——
        那时 <code>score</code> 已经解包成数字，再点 <code>.value</code> 得到的是
        <code>undefined</code>。
      </p>
      <button class="btn" type="button" @click="changeScore">加十分</button>
      <button class="btn ghost" type="button" @click="reset">重置为 60</button>
    </div>

    <div class="panel">
      <p class="panel-title muted">这个 ref 对象本身长什么样</p>
      <p>
        <code>{{ refShape }}</code>
      </p>
      <p class="hint">
        ref 是一个带 <code>.value</code> 的包装对象（RefImpl 实例），值存在
        <code>.value</code> 上；直接把它和数字相加会得到字符串拼接，所以脚本里必须先
        <code>.value</code> 取值。
      </p>
    </div>

    <div class="panel">
      <p class="panel-title muted">点击按钮时打印的日志</p>
      <pre class="console">{{ logText || '// 还没有点击按钮' }}</pre>
    </div>

    <CodePanel file="RefValueDemo.vue" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CodePanel from './CodePanel.vue'

const score = ref(60)
const logs = ref([])

// 模板会被自动解包，所以“脚本视角”的取值单独用一个计算属性展示
const scriptValue = computed(() => score.value)

// 把 ref 对象的形状拼出来，方便肉眼观察包装结构
const refShape = computed(() => `RefImpl { value: ${score.value} }`)
const logText = computed(() => logs.value.join('\n'))

const changeScore = () => {
  score.value += 10 // 脚本：必须 .value
  console.log('ref 对象本身：', score) // RefImpl { value: 70 }
  console.log('真实数值：', score.value) // 70

  // 同时把这两行打印结果搬到页面上，方便对照
  logs.value.push(
    `score.value += 10 → 当前 ${score.value}`,
    `console.log(score) 打印：RefImpl { value: ${score.value} }`,
    `console.log(score.value) 打印：${score.value}`
  )
}

const reset = () => {
  score.value = 60
  logs.value.push('score.value = 60 → 已重置')
}
</script>
