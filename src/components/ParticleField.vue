<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({ enabled: { type: Boolean, default: true } })
const canvas = ref(null)
const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false }
let context
let motionPreference
let width = 0
let height = 0
let frame = 0
let lastPaint = 0
let time = 0
let particles = []
let sparks = []
let ripples = []

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24,
    radius: 0.7 + Math.random() * 1.3,
    phase: Math.random() * Math.PI * 2,
    purple: Math.random() > 0.76,
  }
}

function resize() {
  width = document.documentElement.clientWidth
  height = window.innerHeight
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.value.width = Math.round(width * ratio)
  canvas.value.height = Math.round(height * ratio)
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  const limit = width < 640 ? 32 : 85
  const count = Math.min(limit, Math.max(22, Math.round(width * height / 14000)))
  particles = Array.from({ length: count }, createParticle)
  sparks = []
  ripples = []
  resetPointer()
  paint(0)
}

function paint(delta) {
  context.clearRect(0, 0, width, height)
  if (!props.enabled) return
  const step = delta * 60
  time += delta
  const ease = 1 - Math.exp(-delta * 12)
  pointer.x += (pointer.targetX - pointer.x) * ease
  pointer.y += (pointer.targetY - pointer.y) * ease

  for (const particle of particles) {
    particle.x = (particle.x + particle.vx * step + width) % width
    particle.y = (particle.y + particle.vy * step + height) % height
    const dx = pointer.x - particle.x
    const dy = pointer.y - particle.y
    const distance = Math.hypot(dx, dy)
    const attraction = pointer.active ? Math.max(0, 1 - distance / 210) * 0.14 : 0
    particle.drawX = particle.x + dx * attraction
    particle.drawY = particle.y + dy * attraction
    particle.nearPointer = pointer.active && distance < 180
  }

  for (let index = 0; index < particles.length; index++) {
    const particle = particles[index]
    for (let next = index + 1; next < particles.length; next++) {
      const neighbor = particles[next]
      const distance = Math.hypot(particle.drawX - neighbor.drawX, particle.drawY - neighbor.drawY)
      if (distance > 125) continue
      const opacity = (1 - distance / 125) * (particle.nearPointer ? 0.29 : 0.12)
      context.strokeStyle = `rgba(98, 199, 240, ${opacity})`
      context.lineWidth = 0.6
      context.beginPath()
      context.moveTo(particle.drawX, particle.drawY)
      context.lineTo(neighbor.drawX, neighbor.drawY)
      context.stroke()
    }

    if (particle.nearPointer) {
      const opacity = (1 - Math.hypot(particle.drawX - pointer.x, particle.drawY - pointer.y) / 210) * 0.32
      context.strokeStyle = `rgba(136, 234, 255, ${opacity})`
      context.beginPath()
      context.moveTo(pointer.x, pointer.y)
      context.lineTo(particle.drawX, particle.drawY)
      context.stroke()
    }
    const opacity = 0.3 + Math.sin(time * 0.8 + particle.phase) * 0.16 + (particle.nearPointer ? 0.3 : 0)
    const color = particle.purple ? '188, 132, 255' : '117, 223, 255'
    context.fillStyle = `rgba(${color}, ${opacity * 0.1})`
    context.beginPath()
    context.arc(particle.drawX, particle.drawY, particle.radius * 4, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = `rgba(${color}, ${opacity})`
    context.beginPath()
    context.arc(particle.drawX, particle.drawY, particle.radius, 0, Math.PI * 2)
    context.fill()
  }

  sparks = sparks.filter(spark => spark.life > 0)
  for (const spark of sparks) {
    spark.life -= delta
    spark.x += spark.vx * delta
    spark.y += spark.vy * delta
    spark.vx *= Math.exp(-delta * 2.8)
    spark.vy *= Math.exp(-delta * 2.8)
    const opacity = Math.max(0, spark.life / spark.duration)
    context.fillStyle = `rgba(${spark.purple ? '199, 143, 255' : '139, 243, 255'}, ${opacity * 0.85})`
    context.beginPath()
    context.arc(spark.x, spark.y, 1.6 * opacity + 0.4, 0, Math.PI * 2)
    context.fill()
  }

  ripples = ripples.filter(ripple => ripple.life > 0)
  for (const ripple of ripples) {
    ripple.life -= delta
    const progress = 1 - Math.max(0, ripple.life) / 0.85
    context.strokeStyle = `rgba(135, 231, 255, ${(1 - progress) * 0.35})`
    context.lineWidth = 1
    context.beginPath()
    context.arc(ripple.x, ripple.y, 8 + progress * 72, 0, Math.PI * 2)
    context.stroke()
  }
}

function animate(timestamp) {
  frame = 0
  if (document.hidden || motionPreference.matches || !props.enabled) return
  if (!lastPaint) lastPaint = timestamp
  if (timestamp - lastPaint >= 32) {
    paint(Math.min((timestamp - lastPaint) / 1000, 0.06))
    lastPaint = timestamp
  }
  frame = window.requestAnimationFrame(animate)
}

function resetPointer() {
  pointer.active = false
}

function movePointer(event) {
  if (!props.enabled || motionPreference.matches || event.pointerType !== 'mouse') return
  if (event.target instanceof Element && event.target.closest('.honor-modal')) return resetPointer()
  if (!pointer.active) {
    pointer.x = event.clientX
    pointer.y = event.clientY
  }
  pointer.targetX = event.clientX
  pointer.targetY = event.clientY
  pointer.active = true
}

function burst(event) {
  if (!props.enabled || motionPreference.matches || event.button !== 0 || !event.isPrimary) return
  if (event.target instanceof Element && event.target.closest('input, textarea, select, .honor-modal, .utility-controls')) return
  const count = width < 640 ? 12 : 22
  for (let index = 0; index < count; index++) {
    const angle = Math.PI * 2 * index / count + Math.random() * 0.2
    const speed = 45 + Math.random() * 115
    const duration = 0.55 + Math.random() * 0.5
    sparks.push({
      x: event.clientX, y: event.clientY,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: duration, duration, purple: index % 3 === 0,
    })
  }
  // Bound the work even during rapid clicks or repeated touchscreen taps.
  sparks = sparks.slice(-132)
  ripples.push({ x: event.clientX, y: event.clientY, life: 0.85 })
  ripples = ripples.slice(-6)
}

function syncAnimation() {
  if (!context || !motionPreference) return
  window.cancelAnimationFrame(frame)
  frame = 0
  lastPaint = 0
  sparks = []
  ripples = []
  resetPointer()
  paint(0)
  if (!document.hidden && !motionPreference.matches && props.enabled) frame = window.requestAnimationFrame(animate)
}

onMounted(() => {
  context = canvas.value.getContext('2d')
  if (!context) return
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  resize()
  syncAnimation()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', movePointer, { passive: true })
  window.addEventListener('pointerdown', burst, { passive: true })
  window.addEventListener('blur', resetPointer)
  document.addEventListener('pointerleave', resetPointer)
  document.addEventListener('visibilitychange', syncAnimation)
  motionPreference.addEventListener('change', syncAnimation)
})

watch(() => props.enabled, syncAnimation)

onUnmounted(() => {
  window.cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', movePointer)
  window.removeEventListener('pointerdown', burst)
  window.removeEventListener('blur', resetPointer)
  document.removeEventListener('pointerleave', resetPointer)
  document.removeEventListener('visibilitychange', syncAnimation)
  motionPreference?.removeEventListener('change', syncAnimation)
})
</script>

<template>
  <canvas ref="canvas" class="particle-field" aria-hidden="true"></canvas>
</template>
