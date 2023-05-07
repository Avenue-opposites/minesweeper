import type { BlockState } from '~/types'

type GameState = 'play' | 'won' | 'lost'
interface MinesweeperState {
  board: BlockState[][]
  mineGenerated: boolean
  status: GameState
  startTime: number
  endTime?: number
}

export default class Minesweeper {
  // 状态
  state = reactive<MinesweeperState>({
    board: [],
    mineGenerated: false,
    status: 'play',
    startTime: 0,
  })

  // 方位
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

  constructor(protected row: number, protected column: number, protected mines: number) {
    this.reset()
  }

  get board() {
    return this.state.board
  }

  get blocks() {
    return this.state.board.flat() as BlockState[]
  }

  get mineGenerated() {
    return this.state.mineGenerated
  }

  get gameState() {
    return this.state.status
  }

  get minesCount() {
    return this.mines
  }

  get startTime() {
    return this.state.startTime
  }

  get endTime() {
    return this.state.endTime
  }

  get flags() {
    let count = 0
    this.blocks.forEach(block => block.flagged && count++)
    return count
  }

  // 重置
  reset() {
    this.state.startTime = Date.now()
    this.state.endTime = 0
    this.state.status = 'play'
    this.state.mineGenerated = false
    this.state.board = Array.from(
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
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        const block = this.board[y][x]
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

  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // 生成地雷
  generateMines(initial: BlockState) {
    const placeRandom = () => {
      const x = this.random(0, this.column - 1)
      const y = this.random(0, this.row - 1)
      const block = this.board[y][x]
      // 第一个附近一圈不会生成地雷
      if (Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1)
        return false
      else if (block.mine)
        return false
      else
        return block.mine = true
    }
    for (let i = 0; i < this.mines; i++) {
      let flag = placeRandom()
      while (!flag)
        flag = placeRandom()
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
      return this.board[y][x]
    }).filter(Boolean) as BlockState[]
  }

  showAllMines() {
    this.board.flat().forEach((block) => {
      if (block.mine)
        block.revealed = true
    })
  }

  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.blocks
    const state = blocks.every(block => block.revealed || (block.flagged && block.mine) || (!block.flagged && block.mine))
    if (state) {
      this.state.status = 'won'
      this.onGameOver()
    }
  }

  protected autoExpand(block: BlockState) {
    const siblings = this.getSiblings(block)
    siblings.forEach((block) => {
      if (block.revealed || block.flagged)
        return
      if (block.mine) {
        block.flagged = true
        return
      }
      block.revealed = true
    })
  }

  onClick(block: BlockState) {
    // 如果没有生成地雷
    if (!this.mineGenerated) {
      // 生成地雷
      this.generateMines(block)
      this.state.mineGenerated = true
    }
    // 如果翻开或者被标记或者游戏结束
    if (block.revealed || block.flagged || this.gameState !== 'play')
      return
    // 点到地雷
    if (block.mine) {
      this.onGameOver()
      this.state.status = 'lost'
      this.showAllMines()
    }
    this.expandZero(block)
    block.revealed = true
  }

  onRightClick(block: BlockState) {
    if (block.revealed || this.gameState !== 'play')
      return
    block.flagged = !block.flagged
  }

  ondblclick(block: BlockState) {
    if (block.revealed)
      this.autoExpand(block)
  }

  onGameOver() {
    this.state.endTime = Date.now()
  }
}
