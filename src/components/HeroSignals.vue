<script setup>
const waves = Array.from({ length: 18 }, (_, index) => ({
  path: `M -80 ${220 + index * 5} C 160 ${60 + index * 9}, 260 ${365 - index * 6}, 540 ${226 + index * 2} S 870 ${115 + index * 8}, 1100 ${205 + index * 3} S 1370 ${285 - index * 10}, 1520 ${90 + index * 8}`,
  opacity: index % 5 === 0 ? 0.5 : 0.1 + index % 3 * 0.045,
}))
const points = Array.from({ length: 37 }, (_, index) => ({
  x: index * 43 - 50,
  y: 135 + Math.sin(index * 1.7) * 75 + Math.cos(index * 0.6) * 36,
}))
const links = points.slice(0, -1).map((point, index) => ({
  x1: point.x,
  y1: point.y,
  x2: points[Math.min(index + 2, points.length - 1)].x,
  y2: points[Math.min(index + 2, points.length - 1)].y,
}))
</script>

<template>
  <svg class="hero-signals" viewBox="0 0 1440 420" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="signal-spectrum" x1="0" y1="200" x2="1440" y2="200" gradientUnits="userSpaceOnUse">
        <stop stop-color="#29dfff" stop-opacity=".1" />
        <stop offset=".24" stop-color="#36dbff" />
        <stop offset=".65" stop-color="#398bff" />
        <stop offset="1" stop-color="#bd5aff" />
      </linearGradient>
      <filter id="signal-glow"><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <g stroke="url(#signal-spectrum)">
      <path v-for="(wave, index) in waves" :key="index" :d="wave.path" :opacity="wave.opacity" :stroke-width="index % 5 === 0 ? 1.5 : .7" />
      <path :d="waves[5].path" stroke-width="6" opacity=".3" filter="url(#signal-glow)" />
    </g>
    <g class="signal-constellation" stroke="#4abaff" stroke-opacity=".18" stroke-width=".8">
      <line v-for="(link, index) in links" :key="index" v-bind="link" />
    </g>
    <g fill="#64dfff">
      <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" :r="index % 4 === 0 ? 2.6 : 1.3" :opacity="index % 4 === 0 ? .8 : .3" />
    </g>
  </svg>
</template>
