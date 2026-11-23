<template>
  <div class="demo-card">
    <div class="grid-2">
      <div class="panel">
        <p class="panel-title">倒计时 · 定时器里改 ref</p>
        <p>
          剩余：<span class="value-text">{{ time }}</span> 秒
          <span class="badge info">{{ running ? '运行中' : '已停止' }}</span>
        </p>
        <button class="btn" type="button" :disabled="running || time === 0" @click="start">
          开始
        </button>
        <button class="btn ghost" type="button" :disabled="!running" @click="stop">暂停</button>
        <button class="btn gray" type="button" @click="reset">重置为 10</button>
        <p class="hint" style="margin-top: 6px">
          组件卸载时 <code>onUnmounted</code> 会清理定时器，避免“组件没了还在改数据”。
        </p>
      </div>

      <div class="panel">
        <p class="panel-title">模拟异步请求 · finally 收回 loading</p>
        <p>
          状态：
          <span class="badge" :class="loading ? 'bad' : 'ok'">{{ loading ? '加载中…' : '空闲' }}</span>
        </p>
        <p class="hint" style="min-height: 24px">{{ result || '点击按钮模拟一次 1.5 秒的请求' }}</p>
        <button class="btn" type="button" :disabled="loading" @click="loadData">
          请求接口
        </button>
        <p class="hint" style="margin-top: 6px">
          无论成功还是失败，<code>finally</code> 都会把 loading 置回 false，不会留下“永久加载中”。
        </p>
      </div>
    </div>

    <p class="hint warn">
      与手册第 4.4 节一致：组件一挂载就开始 10 秒倒计时（进入本页就能看到数字在掉），卸载时在
      <code>onUnmounted</code> 里清理定时器；额外给了暂停与重置按钮，暂停后点“开始”即从当前秒数继续。
    </p>

    <CodePanel file="TimerDemo.vue" />
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import CodePanel from './CodePanel.vue'

/* ---------- 倒计时 ---------- */
const time = ref(10)
const running = ref(false)
let timer = null

function start() {
  if (running.value || time.value <= 0) return
  running.value = true
  timer = setInterval(() => {
    time.value -= 1
    if (time.value <= 0) {
      time.value = 0
      stop() // 归零后主动停止
    }
  }, 1000)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  running.value = false
}

function reset() {
  stop()
  time.value = 10
}

// 组件卸载时清理，避免定时器继续运行
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 与手册一致：挂载即开始倒计时（手册里是直接在 setup 中 setInterval）
start()

/* ---------- 异步请求 ---------- */
const loading = ref(false)
const result = ref('')

async function loadData() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    result.value = `接口返回：请求于 ${new Date().toLocaleTimeString()} 完成`
  } finally {
    loading.value = false
  }
}
</script>
