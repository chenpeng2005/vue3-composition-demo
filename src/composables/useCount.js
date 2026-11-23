import { ref } from 'vue'

/**
 * 组合式函数：把计数逻辑抽出来复用
 * 每次调用都会创建一套独立的 count，互不干扰
 * @param {number} initial 初始值
 */
export function useCount(initial = 0) {
  const count = ref(initial)

  const inc = () => {
    count.value += 1
  }

  const dec = () => {
    count.value -= 1
  }

  const reset = () => {
    count.value = initial
  }

  return { count, inc, dec, reset }
}
