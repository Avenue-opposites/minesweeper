<script setup lang="ts">
import { isDev, toggleDev } from '~/composables'
import Minesweeper from '~/composables/minesweeper'

const isShow = useConfetti(3000)
const minesweeper = new Minesweeper(10, 10, 30)
const board = computed(() => minesweeper.board)
watchEffect(() => {
  // 检查游戏状态
  minesweeper.checkGameState()
})
watch(() => minesweeper.gameState, (value) => {
  isShow.value = value === 'won'
})
</script>

<template>
  <h1 m-5 text-24px font-bold>
    minesweeper
  </h1>
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
      />
    </div>
  </div>
  <p>Total:{{ minesweeper.minesCount }}</p>
  <div flex="~ gap-2" mt-2 justify-center>
    <button btn @click="toggleDev()">
      {{ isDev ? 'dev' : 'normal' }}
    </button>
    <button btn @click="minesweeper.reset">
      reset
    </button>
  </div>
</template>
