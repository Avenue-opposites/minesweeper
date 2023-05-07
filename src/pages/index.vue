<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged: boolean
  adjacentMines: number
}
const SIZE = 10
const fakeArray = { length: SIZE }
const directions = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
]
const numberColors = [
  'text-transparent',
  'text-white-500',
  'text-green-500',
  'text-blue-500',
  'text-purple-500',
  'text-fuchsia-500',
  'text-cyan-500',
  'text-yellow-500',
  'text-pink-500',
]
const state = reactive<BlockState[][]>(Array.from(
  fakeArray,
  (_, y) => Array.from(
    fakeArray,
    (_, x) => ({
      x,
      y,
      revealed: false,
      mine: false,
      flagged: false,
      adjacentMines: 0,
    }),
  ),
),
)
// 是否生成地雷
let mineGenerated = false
// 是否为开发模式
const dev = ref(false)
// 更新数字
function updateNumbers() {
  for (let y = 0; y < state.length; y++) {
    for (let x = 0; x < state[y].length; x++) {
      const block = state[y][x]
      // 当前格子有地雷就无视
      if (block.mine)
        continue
      getSiblings(block).forEach((aroundBlock) => {
        if (aroundBlock.mine)
          block.adjacentMines++
      })
    }
  }
}
// 生成地雷
function generateMines(initial: BlockState, probability: number) {
  for (const row of state) {
    for (const block of row) {
      // 第一个附近一圈不会生成地雷
      if (Math.abs(initial.x - block.x) <= 1 || Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < probability
    }
  }
  // 生成数字
  updateNumbers()
}
// 生成对应格子的样式
function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10'
  return block.mine ? 'text-red-500' : numberColors[block.adjacentMines]
}
// 展开周围没有地雷的格子
function expandZero(block: BlockState) {
  // 判断周围有地雷
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((aroundBlock) => {
    if (aroundBlock.revealed)
      return
    // 周围的格子全部翻开
    aroundBlock.revealed = true
    // 将沿着周围格子全部尝试翻开
    expandZero(aroundBlock)
  })
}
// 获取周边一圈的格子
function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    // 获取周边的坐标
    const x = block.x + dx
    const y = block.y + dy
    // 判断是否超出边界
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE)
      return null
    return state[y][x]
  }).filter(Boolean) as BlockState[]
}
function onClick(block: BlockState) {
  // 如果没有生成地雷
  if (!mineGenerated) {
    // 生成地雷
    generateMines(block, 0.2)
    mineGenerated = true
  }
  // 点到地雷
  if (block.mine) {
    state.forEach((row) => {
      row.forEach((block) => {
        if (block.revealed)
          return
        block.revealed = true
      })
    })
    alert('Boom 游戏结束!')
  }
  if (block.revealed)
    return
  expandZero(block)
  block.revealed = true
}
</script>

<template>
  <h1 m-5 text-24px font-bold>
    minesweeper
  </h1>
  <div v-for="row, y of state" :key="y" flex="~" justify-center>
    <button
      v-for="block, x of row" :key="x"
      :class="getBlockClass(block)"
      flex="~" border="gray-400/10 1"
      m="2px"
      h-10 w-10 items-center justify-center hover="bg-gray-500/50"
      @click="onClick(block)"
    >
      <template v-if="block.revealed || dev">
        <div v-if="block.mine" i-mdi:mine />
        <div v-else>
          {{ block.adjacentMines }}
        </div>
      </template>
    </button>
  </div>
  <button @click="dev = !dev">
    切换dev
  </button>
</template>
