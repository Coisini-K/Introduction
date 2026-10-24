<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let context
let motionPreference
let frame = 0
let width = 0
let height = 0
let lastPaint = 0
let elapsed = 0
let columns = []

// A seeded pattern keeps the backdrop stable when resizing or scrolling.
function noise(value) {
  const result = Math.sin(value * 127.1 + 311.7) * 43758.5453
  return result - Math.floor(result)
}

function paint() {
  if (!context) return
  context.clearRect(0, 0, width, height)
  context.font = '11px Consolas, monospace'
  context.textAlign = 'center'

  for (const column of columns) {
    const head = (elapsed * column.speed + column.offset) % (height + 340) - 170
    const edge = Math.abs(column.x / width - 0.5) * 2
    for (let row = -1; row < height / 23 + 1; row++) {
      const y = row * 23 + (elapsed * column.speed * 0.12) % 23
      const distance = head - y
      const trail = distance >= 0 && distance < 210 ? (1 - distance / 210) : 0
      const opacity = (0.035 + noise(column.seed + row) * 0.055 + trail * 0.2) * (0.45 + edge * 0.75)
      context.fillStyle = column.purple ? `rgba(175, 116, 255, ${opacity})` : `rgba(86, 216, 242, ${opacity})`
      context.fillText(noise(column.seed + row + Math.floor(elapsed * 0.7)) > 0.5 ? '1' : '0', column.x, y)
    }
  }
}

function resize() {
  if (!context) return
  width = window.innerWidth
  height = window.innerHeight
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.value.width = Math.round(width * pixelRatio)
  canvas.value.height = Math.round(height * pixelRatio)
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  const spacing = width < 640 ? 28 : 32
  columns = Array.from({ length: Math.ceil(width / spacing) }, (_, index) => ({
    x: index * spacing + spacing / 2,
    seed: index * 79.3,
    speed: 17 + noise(index + 4) * 16,
    offset: noise(index + 9) * (height + 340),
    purple: index % 7 === 0 || index > width / spacing * 0.8,
  }))
  paint()
}

function animate(timestamp) {
  frame = 0
  if (document.hidden || motionPreference.matches) return
  if (!lastPaint) lastPaint = timestamp
  if (timestamp - lastPaint >= 50) {
    elapsed += Math.min(timestamp - lastPaint, 100) / 1000
    lastPaint = timestamp
    paint()
  }
  frame = window.requestAnimationFrame(animate)
}

function syncAnimation() {
  window.cancelAnimationFrame(frame)
  frame = 0
  lastPaint = 0
  if (!document.hidden && !motionPreference.matches) frame = window.requestAnimationFrame(animate)
  else paint()
}

onMounted(() => {
  context = canvas.value.getContext('2d')
  if (!context) return
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  resize()
  syncAnimation()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', syncAnimation)
  motionPreference.addEventListener('change', syncAnimation)
})

onUnmounted(() => {
  window.cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', syncAnimation)
  motionPreference?.removeEventListener('change', syncAnimation)
})
</script>

<template>
  <div class="binary-backdrop" aria-hidden="true">
    <div class="ambient-glow ambient-glow-cyan"></div>
    <div class="ambient-glow ambient-glow-purple"></div>
    <div class="background-grid"></div>
    <canvas ref="canvas"></canvas>
    <div class="background-vignette"></div>
  </div>
</template>
