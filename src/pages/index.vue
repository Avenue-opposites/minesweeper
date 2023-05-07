<script setup lang="ts">
import Block from '~/components/Block.vue'
import { isDev, toggleDev } from '~/composables'
import Minesweeper from '~/composables/minesweeper'

const minesweeper = new Minesweeper(10, 10, 10)
// const mineCount = computed(() => minesweeper.)
const board = minesweeper.board
watchEffect(() => {
  // 检查游戏状态
  minesweeper.checkGameState()
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
