import type { BlockState } from '~/types'

export default class Minesweeper {
  state: Ref<BlockState[][]> = ref([])
  mineGenerated = false
  static directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ]

  constructor(protected row: number, protected column: number, protected minesGenerateProbability: number) {
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from(
      { length: this.column },
      (_, y) => Array.from(
        { length: this.row },
        (_, x) => ({
          x,
          y,
          revealed: false,
          mine: false,
          flagged: false,
          adjacentMines: 0,
        }),
      ),
    )
  }

  // 更新数字
  protected updateNumbers() {
    for (let y = 0; y < this.state.value.length; y++) {
      for (let x = 0; x < this.state.value[y].length; x++) {
        const block = this.state.value[y][x]
        // 当前格子有地雷就无视
        if (block.mine)
          continue
        this.getSiblings(block).forEach((aroundBlock) => {
          if (aroundBlock.mine)
            block.adjacentMines++
        })
      }
    }
  }

  // 生成地雷
  generateMines(initial: BlockState, probability: number) {
    for (const row of this.state.value) {
      for (const block of row) {
      // 第一个附近一圈不会生成地雷
        if (Math.abs(initial.x - block.x) <= 1 || Math.abs(initial.y - block.y) <= 1)
          continue
        block.mine = Math.random() < probability
      }
    }
    // 生成数字
    this.updateNumbers()
  }

  // 展开周围没有地雷的格子
  expandZero(block: BlockState) {
  // 判断周围有地雷
    if (block.adjacentMines)
      return
    this.getSiblings(block).forEach((aroundBlock) => {
      if (aroundBlock.revealed || aroundBlock.flagged)
        return
      // 周围的格子全部翻开
      aroundBlock.revealed = true
      // 将沿着周围格子全部尝试翻开
      this.expandZero(aroundBlock)
    })
  }

  // 获取周边一圈的格子
  protected getSiblings(block: BlockState) {
    return Minesweeper.directions.map(([dx, dy]) => {
    // 获取周边的坐标
      const x = block.x + dx
      const y = block.y + dy
      // 判断是否超出边界
      if (x < 0 || x >= this.row || y < 0 || y >= this.column)
        return null
      return this.state.value[y][x]
    }).filter(Boolean) as BlockState[]
  }

  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.state.value.flat()
    const gameState = blocks.every(block => block.revealed || (block.flagged && block.mine))
    if (gameState)
      alert('游戏胜利!')
  }

  onClick(block: BlockState) {
    // 如果没有生成地雷
    if (!this.mineGenerated) {
      // 生成地雷
      this.generateMines(block, this.minesGenerateProbability)
      this.mineGenerated = true
    }

    if (block.revealed || block.flagged)
      return
    // 点到地雷
    if (block.mine)
      alert('Boom 游戏结束!')
    this.expandZero(block)
    block.revealed = true
    this.checkGameState()
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
    this.checkGameState()
  }
}
