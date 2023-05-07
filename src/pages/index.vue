<script setup lang="ts">
import { isDev, toggleDev } from '~/composables'
import Minesweeper from '~/composables/minesweeper'

const isShow = useConfetti(1000)
const now = useNow()
const minesweeper = ref(new Minesweeper(10, 10, 20))
const downCount = computed(() => (((minesweeper.value.endTime || +now.value) - minesweeper.value.startTime) / 1000).toFixed(0))
const board = computed(() => minesweeper.value.board)

watchEffect(() => {
  // 检查游戏状态
  minesweeper.value.checkGameState()
})
watch(() => minesweeper.value.gameState, (value) => {
  const state = value === 'won'
  isShow.value = state
})
function setDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      minesweeper.value = new Minesweeper(6, 6, 4)
      break
    case 'medium':
      minesweeper.value = new Minesweeper(10, 10, 20)
      break
    case 'hard':
      minesweeper.value = new Minesweeper(16, 12, 40)
      break
    default:
      break
  }
}
</script>

<template>
  <h1 m-5 text-24px font-bold>
    minesweeper
  </h1>
  <p flex="~ gap-1" items-center justify-center pb-4>
    difficulty:
    <button btn @click="setDifficulty('easy')">
      easy
    </button>
    <button btn @click="setDifficulty('medium')">
      medium
    </button>
    <button btn @click="setDifficulty('hard')">
      hard
    </button>
  </p>
  <p flex="~" items-center justify-center text-6>
    <button i-mdi:clock m-2 />
    <span mr-2>{{ downCount }}</span>
    <button i-mdi:mine m-2 />
    <span>{{ minesweeper.minesCount }}</span>
    <button i-mdi:flag m-2 text-red />
    <span>{{ minesweeper.flags }}</span>
  </p>
  <div min-h-100 min-w-100 overflow-auto>
    <div
      v-for="row, y of board"
      :key="y"
      flex="~"
      justify-center
    >
      <Block
        v-for="block, x of row"
        :key="x"
        :block="block"
        @click="minesweeper.onClick(block)"
        @contextmenu.prevent="minesweeper.onRightClick(block)"
        @dblclick="minesweeper.ondblclick(block)"
      />
    </div>
  </div>
  <div flex="~ gap-2" mt-2 justify-center>
    <button btn @click="toggleDev()">
      {{ isDev ? 'dev' : 'normal' }}
    </button>
    <button btn @click="minesweeper.reset">
      reset
    </button>
  </div>
</template>
