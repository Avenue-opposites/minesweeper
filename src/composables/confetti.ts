import confetti from 'canvas-confetti'

export function useConfetti(time: number) {
  const isShow = ref(false)
  const defaults = {
    colors: [
      '5d8c7b',
      '#bb0000',
      '#ffffff',
    ],
    shapes: ['square'],
    ticks: 500,
    particleCount: 80,
    spread: 55,
  } as confetti.Options
  let timer: any = null
  watch(isShow, (value) => {
    if (value)
      timer = setInterval(squirt, time)
    else
      clearInterval(timer)
  })

  function squirt() {
    confetti({
      ...defaults,
      angle: 55,
      origin: {
        x: 0,
      },
    })
    confetti({
      ...defaults,
      angle: 120,
      origin: {
        x: 1,
      },
    })
  }
  return isShow
}
