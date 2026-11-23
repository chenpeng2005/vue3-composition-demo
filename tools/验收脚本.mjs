// 逐页验收脚本：把打包产物挂到 jsdom 里，模拟点击并断言手册第 3-8 部分的关键行为。
// 用法（在项目根目录执行）：
//   npm install --no-save jsdom
//   npm run build
//   node tools/验收脚本.mjs
// 退出码 0 表示全部断言通过。
import { readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost/'
})
const { window } = dom
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'SVGElement', 'Document', 'ShadowRoot', 'Text', 'Comment', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'MutationObserver']) {
  if (key in window) Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true })
}

const consoleLogs = []
const realLog = console.log
console.log = (...a) => { consoleLogs.push(a.join(' ')) }
const errors = []
window.addEventListener('error', (e) => errors.push(e.message))

const jsFile = readdirSync('dist/assets').find((f) => f.endsWith('.js'))
await import(pathToFileURL(`${process.cwd()}/dist/assets/${jsFile}`).href)

const app = document.getElementById('app')
const wait = (ms = 90) => new Promise((r) => setTimeout(r, ms))
const nav = async (i) => { [...app.querySelectorAll('.nav-item')][i].click(); await wait(130) }
const demo = () => app.querySelector('.demo')
const btn = (t) => [...demo().querySelectorAll('button')].find((b) => b.textContent.trim() === t)
const vals = () => [...demo().querySelectorAll('.value-text')].map((n) => n.textContent.trim())

const rows = []
const step = (id, name, ok, detail) => rows.push({ id, name, ok: !!ok, detail })

await wait(250)
const pageTitles = [...app.querySelectorAll('.nav-item')].map((b) => b.textContent.replace(/\s+/g, ' ').trim())

// ---------- 3.x 入门 ----------
await nav(0)
const h3 = () => demo().querySelector('.box h3').textContent.trim()
step('3.2', '模板+script setup 渲染', h3() === 'Hello Vue3 组合式 API', h3())
btn('点我改文案').click(); await wait(80)
step('3.4', '脚本里改 msg.value 生效', h3() === '我学会 script setup 啦', h3())

// ---------- 4.1 计数器 ----------
await nav(2)
step('4.1', '初始计数 0', vals()[0] === '0', vals()[0])
btn('加一').click(); await wait(60); btn('加一').click(); await wait(60); btn('减一').click(); await wait(60)
step('4.1', 'add×2 / reduce×1 结果为 1', vals()[0] === '1', vals()[0])

// ---------- 4.2 ref 类型 ----------
await nav(3)
step('4.2', '初始 name=小明、已关闭、小红 16', vals().join('|') === '小明|已关闭|小红|16', vals().join('|'))
btn('切换状态并长大一岁').click(); await wait(80)
step('4.2', 'toggle 后：已开启 + 17 岁', vals()[1] === '已开启' && vals()[3] === '17', vals().join('|'))

// ---------- 4.3 .value ----------
await nav(4)
step('4.3', '初始分数 60', vals()[0] === '60', vals()[0])
btn('加十分').click(); await wait(80)
step('4.3', '加十分后 70', vals()[0] === '70', vals()[0])
step('4.3', '真实 console.log 输出两条', consoleLogs.filter((l) => l.includes('ref 对象本身') || l.includes('真实数值')).length >= 2, consoleLogs.slice(-2).join(' / '))

// ---------- 4.4 定时器 ----------
await nav(5)
const t0 = Number(vals()[0])
await wait(1400)
const t1 = Number(vals()[0])
step('4.4', '挂载即开始倒计时（10→9）', t0 === 10 && t1 === 9, `${t0} -> ${t1}`)
btn('暂停').click(); await wait(60)
const t2 = Number(vals()[0]); await wait(1200)
step('4.4', '暂停后不再递减', Number(vals()[0]) === t2, `${t2} -> ${vals()[0]}`)
btn('重置为 10').click(); await wait(60)
step('4.4', '重置回 10', vals()[0] === '10', vals()[0])

// ---------- 5.1 表单 ----------
await nav(6)
const pw = demo().querySelector('input[type="password"]')
pw.value = 'abc123'; pw.dispatchEvent(new window.Event('input', { bubbles: true }))
await wait(80)
step('5.1', '密码长度随输入变为 6', vals()[1] === '6', vals()[1])

// ---------- 5.2 解构 ----------
await nav(7)
for (let i = 0; i < 3; i++) { btn('state.count 加一').click(); await wait(40) }
step('5.2', '源对象=3、解构值仍 0', vals()[0] === '3' && vals()[1] === '0', `${vals()[0]} / ${vals()[1]}`)

// ---------- 5.3 toRefs ----------
await nav(8)
btn('count 加一').click(); await wait(50); btn('从 state 侧加一').click(); await wait(50)
step('5.3', '两侧联动同为 2', vals()[0] === '2' && vals()[1] === '2', `${vals()[0]} / ${vals()[1]}`)

// ---------- 5.4 toRef ----------
await nav(9)
btn('长大一岁').click(); await wait(50)
step('5.4', 'age 12→13', vals()[1] === '13', vals()[1])
btn('换个人名').click(); await wait(50)
step('5.4', 'name 改名为 小张', vals()[0] === '小张', vals()[0])

// ---------- 5.5 整体替换 ----------
await nav(10)
step('5.5', '初始 张三/20、王五/30', vals().slice(0, 4).join('|') === '张三|20|王五|30', vals().slice(0, 4).join('|'))
btn('方案二：Object.assign').click(); await wait(60)
step('5.5', 'Object.assign 生效：李四/25', vals()[0] === '李四' && vals()[1] === '25', `${vals()[0]}/${vals()[1]}`)
btn('方案三：ref 整体替换').click(); await wait(60)
step('5.5', 'ref 整体替换后仍为 王五/30', vals()[2] === '王五' && vals()[3] === '30', `${vals()[2]}/${vals()[3]}`)
btn('userBroken = 新对象').click(); await wait(60)
step('5.5', '错误示范：赋值后界面卡住（仍 张三）', vals()[4] === '张三', vals()[4])
btn('触发一次重渲染').click(); await wait(60)
step('5.5', '重渲染后跳变 李四（复现坑）', vals()[4] === '李四', vals()[4])

// ---------- 5.6 Proxy ----------
await nav(11)
consoleLogs.length = 0
btn('读取 proxy.num').click(); await wait(80)
step('5.6', 'console 打印“读取属性”', consoleLogs.some((l) => l.includes('读取属性')), consoleLogs.join(' / '))
consoleLogs.length = 0
btn('proxy.num = 10').click(); await wait(80)
step('5.6', 'console 打印“修改属性”', consoleLogs.some((l) => l.includes('修改属性')), consoleLogs.join(' / '))
step('5.6', '页面日志面板有记录', demo().querySelector('.console').textContent.includes('修改属性'), '已记录')

// ---------- 6 / 7 速查表 ----------
await nav(1)
const tables = [...demo().querySelectorAll('table')]
step('6', '错误速查表 6 行', tables[2].querySelectorAll('tbody tr').length === 6, `${tables[2].querySelectorAll('tbody tr').length} 行`)
step('7', 'ref/reactive 对照表 5 行', tables[3].querySelectorAll('tbody tr').length === 5, `${tables[3].querySelectorAll('tbody tr').length} 行`)
step('2.6', '命令与报错表齐备', tables.length === 4, `${tables.length} 张表`)

// ---------- 8 练习 ----------
await nav(12)
const uname = demo().querySelector('input[type="text"]')
uname.value = 'vue_student'; uname.dispatchEvent(new window.Event('input', { bubbles: true }))
await wait(80)
step('练习1', '输入写入 ref', vals()[0] === 'vue_student', vals()[0])
step('练习1', '源对象 JSON 同步', demo().querySelector('.console').textContent.includes('"username": "vue_student"'), '已同步')
btn('从源对象侧改账号').click(); await wait(80)
step('练习1', '反向：改源对象输入框跟着变', demo().querySelector('input[type="text"]').value.startsWith('from_source_'), demo().querySelector('input[type="text"]').value)

await nav(13)
const incA = [...demo().querySelectorAll('button')].filter((b) => b.textContent.trim() === 'inc')[0]
for (let i = 0; i < 3; i++) { incA.click(); await wait(40) }
step('练习2', 'A 加到 3、B 仍为 10', vals()[0] === '3' && vals()[1] === '10', `${vals()[0]} / ${vals()[1]}`)
btn('reset').click(); await wait(60)
step('练习2', 'A 的 reset 回 0，B 不受影响', vals()[0] === '0' && vals()[1] === '10', `${vals()[0]} / ${vals()[1]}`)

await nav(14)
btn('userB = 新对象').click(); await wait(60)
step('练习3', '整体赋值后界面不变（张三）', vals()[4] === '张三', vals()[4])
btn('stateAFixed.count 加一').click(); await wait(60)
step('练习3', 'toRefs 修复后联动 1/1', vals()[2] === '1' && vals()[3] === '1', `${vals()[2]} / ${vals()[3]}`)
btn('Object.assign 合并').click(); await wait(60)
step('练习3', 'Object.assign 修复生效 李四/25', vals()[6] === '李四' && vals()[7] === '25', `${vals()[6]} / ${vals()[7]}`)
btn('整体替换 ref.value').click(); await wait(60)
step('练习3', 'ref 修复生效 李四/25', vals()[8] === '李四' && vals()[9] === '25', `${vals()[8]} / ${vals()[9]}`)

realLog('页面（15 个）：' + pageTitles.join(' | '))
realLog('')
for (const r of rows) realLog(`${r.ok ? 'PASS' : 'FAIL'}  [${r.id}] ${r.name}  实际=${r.detail}`)
realLog('')
realLog(`合计：${rows.filter((r) => r.ok).length}/${rows.length} 通过；运行错误 ${errors.length} 条`)
errors.forEach((e) => realLog('  - ' + e))
process.exit(rows.every((r) => r.ok) && errors.length === 0 ? 0 : 1)
