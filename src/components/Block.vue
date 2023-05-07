<script setup lang="ts">
import { isDev } from '~/composables'
import type { BlockState } from '~/types'

defineProps<{
  block: BlockState
}>()
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
// 生成对应格子的样式
function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-300'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray/50'
  return block.mine ? 'text-red-500' : numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    :class="getBlockClass($props.block)"
    flex="~"
    border="gray-400/10 1"
    m="2px"
    h-10
    w-10
    items-center
    justify-center
    font-900
  >
    <template v-if="$props.block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-if="$props.block.revealed || isDev">
      <div v-if="$props.block.mine" i-mdi:mine />
      <div v-else>
        {{ $props.block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
