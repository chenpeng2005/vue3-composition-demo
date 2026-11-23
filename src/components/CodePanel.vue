<template>
  <div class="code-panel">
    <button class="code-toggle" type="button" @click="open = !open">
      <span>{{ open ? '收起源码' : '查看源码' }}</span>
      <span class="file-name">{{ file }}</span>
    </button>
    <pre v-show="open" class="code-body"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  file: {
    type: String,
    required: true
  }
})

// Vite 的 ?raw 查询参数：把源文件直接当字符串导入，
// 方便在页面里对照“看到的效果”和“写出的代码”。
const componentSources = import.meta.glob('./*.vue', {
  query: '?raw',
  import: 'default',
  eager: true
})

const composableSources = import.meta.glob('../composables/*.js', {
  query: '?raw',
  import: 'default',
  eager: true
})

const code = computed(
  () =>
    componentSources[`./${props.file}`] ??
    composableSources[`../composables/${props.file}`] ??
    '// 未找到源码'
)

const open = ref(false)
</script>
