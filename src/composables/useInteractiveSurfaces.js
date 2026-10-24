import { onMounted, onUnmounted } from 'vue'

export function useInteractiveSurfaces() {
  let activeSurface = null
  let frame = 0
  let pointer = null
  let motionPreference

  function reset() {
    window.cancelAnimationFrame(frame)
    frame = 0
    activeSurface?.classList.remove('is-pointer-active')
    activeSurface?.style.removeProperty('--tilt-x')
    activeSurface?.style.removeProperty('--tilt-y')
    activeSurface = null
  }

  function update() {
    frame = 0
    const surface = pointer.target instanceof Element ? pointer.target.closest('[data-interactive]') : null
    if (surface !== activeSurface) {
      reset()
      activeSurface = surface
    }
    if (!surface) return
    const rect = surface.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, pointer.x - rect.left))
    const y = Math.max(0, Math.min(rect.height, pointer.y - rect.top))
    surface.style.setProperty('--pointer-x', `${x}px`)
    surface.style.setProperty('--pointer-y', `${y}px`)
    surface.style.setProperty('--tilt-x', `${(0.5 - y / rect.height) * 5}deg`)
    surface.style.setProperty('--tilt-y', `${(x / rect.width - 0.5) * 5}deg`)
    surface.classList.add('is-pointer-active')
  }

  function move(event) {
    if (motionPreference.matches || event.pointerType !== 'mouse') return reset()
    pointer = { target: event.target, x: event.clientX, y: event.clientY }
    if (!frame) frame = window.requestAnimationFrame(update)
  }

  onMounted(() => {
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', reset, { passive: true })
    window.addEventListener('blur', reset)
    document.addEventListener('pointerleave', reset)
    motionPreference.addEventListener('change', reset)
  })

  onUnmounted(() => {
    reset()
    window.removeEventListener('pointermove', move)
    window.removeEventListener('scroll', reset)
    window.removeEventListener('blur', reset)
    document.removeEventListener('pointerleave', reset)
    motionPreference?.removeEventListener('change', reset)
  })
}
