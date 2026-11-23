<template>
  <div class="demo-card">
    <div class="panel">
      <p class="panel-title">手写 Proxy，观察 get / set 拦截</p>
      <p>
        原始对象 raw.num：<span class="value-text">{{ rawNum }}</span>
        <span class="badge info">普通对象，无拦截</span>
      </p>
      <p>
        代理对象 proxy.num：<span class="value-text">{{ proxyNum }}</span>
        <span class="badge ok">每次读写都会被记录</span>
      </p>
      <button class="btn" type="button" @click="readProxy">读取 proxy.num</button>
      <button class="btn" type="button" @click="writeProxy">proxy.num = 10</button>
      <button class="btn ghost" type="button" @click="writeRaw">直接改 raw.num = 20</button>
      <button class="btn gray" type="button" @click="clearLogs">清空日志</button>
      <pre class="console">{{ logText || '// 点击上面的按钮，这里会打印拦截过程' }}</pre>
    </div>

    <p class="hint warn">
      注意：这段代码只用于理解原理，业务代码不会手写 Proxy。真实的响应式系统在 get/set
      之间还多了依赖收集与副作用调度：读的时候记录“谁在用我”（track），写的时候通知
      “谁该更新”（trigger）。理解了这条链路，就能明白为什么解构会失效——被解构出来的普通值
      根本没有参与依赖收集。
    </p>

    <div class="panel">
      <p class="panel-title muted">另外澄清一个常见误解</p>
      <p class="hint">
        Proxy 只是提供了“能拦截”的能力。Vue3 比 Vue2 快，主要来自编译期优化与更轻的运行时，
        而不是 Proxy 本身更快。
      </p>
    </div>

    <CodePanel file="ProxyPrinciple.vue" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CodePanel from './CodePanel.vue'

const raw = { num: 1 }
const logs = ref([])

function pushLog(message) {
  logs.value.push(`${new Date().toLocaleTimeString()}  ${message}`)
}

const proxy = new Proxy(raw, {
  get(target, key) {
    console.log('读取属性：', key)
    pushLog(`读取属性：${String(key)}`)
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    console.log('修改属性：', key, '=', value)
    pushLog(`修改属性：${String(key)} = ${value}`)
    return Reflect.set(target, key, value)
  }
})

const logText = computed(() => logs.value.join('\n'))

// 用两个 ref 保存展示值，避免渲染时又触发一次 get 日志
const rawNum = ref(raw.num)
const proxyNum = ref(raw.num)

const syncView = () => {
  rawNum.value = raw.num
  proxyNum.value = raw.num
}

function readProxy() {
  const value = proxy.num // 这一次读取会触发 get 拦截
  proxyNum.value = value
}

function writeProxy() {
  proxy.num = 10 // 触发 set 拦截
  syncView()
}

function writeRaw() {
  raw.num = 20
  pushLog('直接改 raw.num = 20：没有经过代理，不会触发 set 拦截')
  syncView()
}

function clearLogs() {
  logs.value = []
}
</script>
