<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Award, ChevronLeft, ChevronRight, Maximize2, Search, X } from '@lucide/vue'
import { honors } from '../data/honors'

const levels = ['全部奖项', '一等奖', '二等奖', '三等奖', '优秀奖', '其他荣誉']
const milestones = [
  { year: '2022', title: '从校园出发', detail: '以财经素养竞赛为起点，建立持续参赛与复盘的习惯。' },
  { year: '2023', title: '积累与担当', detail: '奖学金、学生工作与校园实践，让成长不止于专业能力。' },
  { year: '2024', title: '跨向技术赛场', detail: '网页开发、云计算与视觉设计，多方向探索能力边界。' },
  { year: '2025', title: '走向更大的舞台', detail: '在人工智能、创新创业与数字技术赛事中持续突破。' },
]

const query = ref('')
const level = ref(levels[0])
const activeHonor = ref(null)
const closeButton = ref(null)
const dialog = ref(null)
let previousFocus = null
let previousOverflow = ''
let scrollLocked = false

const filteredHonors = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return honors.filter((honor) => {
    const matchesLevel = level.value === levels[0]
      || (level.value === '其他荣誉'
        ? !levels.slice(1, 5).includes(honor.level)
        : honor.level === level.value)
    const matchesQuery = !needle
      || `${honor.title} ${honor.subtitle} ${honor.category} ${honor.year} ${honor.level}`.toLowerCase().includes(needle)
    return matchesLevel && matchesQuery
  })
})
const activeIndex = computed(() => filteredHonors.value.findIndex((honor) => honor.id === activeHonor.value?.id))
const assetUrl = (path) => `${import.meta.env.BASE_URL}honors/${path}`
const coverUrl = (honor) => assetUrl(honor.cover || honor.file)
const viewUrl = (honor) => assetUrl(honor.view || honor.file)

function openHonor(honor, event) {
  previousFocus = event.currentTarget
  activeHonor.value = honor
  nextTick(() => closeButton.value?.focus())
}

function closeHonor() {
  activeHonor.value = null
  nextTick(() => previousFocus?.focus())
}

function move(direction) {
  if (activeIndex.value < 0) return
  const next = (activeIndex.value + direction + filteredHonors.value.length) % filteredHonors.value.length
  activeHonor.value = filteredHonors.value[next]
}

function onKeydown(event) {
  if (!activeHonor.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeHonor()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    move(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'Tab') {
    const controls = [...dialog.value.querySelectorAll('button')]
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

watch(activeHonor, (honor) => {
  if (honor && !scrollLocked) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scrollLocked = true
  } else if (!honor && scrollLocked) {
    document.body.style.overflow = previousOverflow
    scrollLocked = false
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <section id="awards" class="honors-section" aria-labelledby="awards-title">
    <div class="honors-inner">
      <div class="honors-heading" data-reveal>
        <div>
          <p class="section-kicker"><Award :size="17" /> Recognition</p>
          <h2 id="awards-title">荣誉档案</h2>
        </div>
        <p>大学期间累计获得 5 项省奖、7 项国奖。这里记录竞赛、校园工作与成长经历中的每一份成果。</p>
      </div>

      <div class="honors-toolbar" data-reveal>
        <p><strong>{{ honors.length }}</strong><span>份荣誉记录</span></p>
        <div class="honors-controls">
          <label class="honors-search">
            <Search :size="18" aria-hidden="true" />
            <input v-model="query" type="search" placeholder="搜索赛事、领域或年份" aria-label="搜索荣誉" />
          </label>
          <select v-model="level" aria-label="按奖项等级筛选">
            <option v-for="item in levels" :key="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <p class="honors-count" aria-live="polite">显示 {{ filteredHonors.length }} 项</p>
      <div v-if="filteredHonors.length" class="honors-grid">
        <button v-for="honor in filteredHonors" :key="honor.id" class="honor-card" type="button" :aria-label="`查看${honor.title}证书原件`" @click="openHonor(honor, $event)">
          <span class="honor-image">
            <img :src="coverUrl(honor)" :alt="`${honor.title}证书缩略图`" loading="lazy" />
            <span class="honor-open"><Maximize2 :size="19" aria-hidden="true" /></span>
          </span>
          <span class="honor-meta"><span>{{ honor.year }} · {{ honor.category }}</span><strong>{{ honor.level }}</strong></span>
          <span class="honor-title">{{ honor.title }}</span>
          <span class="honor-subtitle">{{ honor.subtitle }}</span>
        </button>
      </div>
      <div v-else class="honors-empty">
        <p>没有找到相关荣誉</p>
        <button type="button" @click="query = ''; level = levels[0]">清除筛选</button>
      </div>

      <div class="journey" data-reveal>
        <div class="journey-heading"><h3>成长轨迹</h3><span>2022 - 2025</span></div>
        <ol>
          <li v-for="item in milestones" :key="item.year">
            <span>{{ item.year }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.detail }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>

  <div v-if="activeHonor" class="honor-modal" role="dialog" aria-modal="true" :aria-label="`${activeHonor.title}证书原件`" @click.self="closeHonor">
    <div ref="dialog" class="honor-dialog">
      <div class="honor-dialog-top">
        <div>
          <span>{{ activeHonor.year }} · {{ activeHonor.category }}</span>
          <h2>{{ activeHonor.title }}</h2>
        </div>
        <button ref="closeButton" type="button" class="honor-close" aria-label="关闭证书" title="关闭" @click="closeHonor"><X :size="22" /></button>
      </div>
      <div class="honor-viewer">
        <img :key="activeHonor.id" :src="viewUrl(activeHonor)" :alt="`${activeHonor.title}证书原件`" />
      </div>
      <div class="honor-dialog-bottom">
        <p><strong>{{ activeHonor.level }}</strong><span>{{ activeHonor.subtitle }}</span></p>
        <div class="honor-dialog-actions">
          <span class="honor-position">{{ activeIndex + 1 }} / {{ filteredHonors.length }}</span>
          <button type="button" aria-label="上一项荣誉" title="上一项" @click="move(-1)"><ChevronLeft :size="21" /></button>
          <button type="button" aria-label="下一项荣誉" title="下一项" @click="move(1)"><ChevronRight :size="21" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.honors-section {
  --ink: #14211d;
  --muted: #51645b;
  --line: #b9c9bf;
  --teal: #006e62;
  --coral: #bd306e;
  --acid: #a8d52a;
  scroll-margin-top: 72px;
  padding: 104px max(24px, calc((100vw - 1160px) / 2));
  color: var(--ink);
  color-scheme: light;
  background:
    linear-gradient(90deg, rgba(0, 110, 98, .055) 1px, transparent 1px) 0 0 / 80px 80px,
    #e8f1e9;
}

.honors-inner { max-width: 1160px; margin: 0 auto; }
.honors-heading { display: flex; align-items: end; justify-content: space-between; gap: 40px; margin-bottom: 42px; }
.honors-heading h2 { margin: 0; font-size: clamp(38px, 5vw, 62px); line-height: 1.1; text-shadow: 2px 2px 0 rgba(0, 110, 98, .17); }
.honors-heading h2::after { display: inline-block; width: 9px; height: 9px; margin-left: 13px; background: #bd306e; content: ''; }
.honors-heading > p { max-width: 390px; margin: 0 0 4px; color: var(--muted); font-size: 15px; line-height: 1.8; }
.honors-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 20px 0; border-top: 2px solid var(--ink); border-bottom: 1px solid var(--line); }
.honors-toolbar > p { display: flex; align-items: baseline; gap: 10px; margin: 0; white-space: nowrap; }
.honors-toolbar > p strong { color: var(--teal); font-size: 31px; line-height: 1; }
.honors-toolbar > p span { color: var(--muted); font-size: 13px; }
.honors-controls { display: flex; gap: 10px; }
.honors-search { display: flex; align-items: center; gap: 10px; width: min(360px, 36vw); height: 44px; padding: 0 13px; border: 1px solid #93ada2; background: #f7fbf4; color: var(--teal); }
.honors-search:focus-within, .honors-controls select:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.honors-search input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font: inherit; font-size: 14px; }
.honors-search input::placeholder { color: #697d72; }
.honors-controls select { min-width: 135px; height: 44px; padding: 0 12px; border: 1px solid #93ada2; border-radius: 0; color: var(--ink); background: #f7fbf4; font: inherit; font-size: 14px; cursor: pointer; }
.honors-count { margin: 22px 0 19px; color: var(--muted); font-size: 13px; }
.honors-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px 24px; }
.honor-card { display: block; min-width: 0; padding: 0 0 20px; border: 0; border-bottom: 1px solid var(--line); color: var(--ink); background: transparent; text-align: left; font: inherit; cursor: pointer; transition: border-color 220ms ease; }
.honor-card:hover { border-bottom-color: var(--teal); }
.honor-card:focus-visible { outline: 2px solid var(--teal); outline-offset: 5px; }
.honor-image { position: relative; display: block; overflow: hidden; width: 100%; aspect-ratio: 4 / 3; border: 1px solid #91aca0; background: #dce5e1; }
.honor-image::after { position: absolute; inset: 0; border: 3px solid transparent; content: ''; pointer-events: none; transition: border-color 200ms ease; }
.honor-card:hover .honor-image::after, .honor-card:focus-visible .honor-image::after { border-color: var(--acid); }
.honor-image img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 300ms ease, filter 300ms ease; }
.honor-card:hover .honor-image img, .honor-card:focus-visible .honor-image img { transform: scale(1.045); filter: saturate(1.12); }
.honor-open { position: absolute; right: 12px; bottom: 12px; display: grid; place-items: center; width: 38px; height: 38px; color: #101514; background: #d8fb5f; box-shadow: 3px 3px 0 #bd306e; }
.honor-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 15px 0 9px; color: var(--muted); font-size: 12px; }
.honor-meta strong { flex: none; padding: 4px 7px; border: 1px solid #81aaa0; color: var(--teal); font-size: 11px; font-weight: 700; }
.honor-title { display: block; font-size: 18px; font-weight: 750; line-height: 1.45; overflow-wrap: anywhere; }
.honor-subtitle { display: block; margin-top: 7px; color: var(--muted); font-size: 13px; line-height: 1.5; }
.honors-empty { display: grid; justify-items: center; gap: 10px; padding: 80px 20px; border-bottom: 1px solid var(--line); color: var(--muted); }
.honors-empty p { margin: 0; }
.honors-empty button { padding: 6px 0; border: 0; border-bottom: 1px solid var(--teal); color: var(--teal); background: none; font: inherit; font-weight: 700; cursor: pointer; }
.journey { margin-top: 88px; }
.journey-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; border-bottom: 2px solid var(--ink); }
.journey-heading h3 { margin: 0 0 19px; font-size: 30px; }
.journey-heading span { color: var(--teal); font-size: 13px; font-weight: 700; }
.journey ol { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin: 0; padding: 0; list-style: none; }
.journey li { min-width: 0; padding-top: 24px; }
.journey li span { display: block; margin-bottom: 14px; color: var(--coral); font-size: 13px; font-weight: 800; }
.journey li strong { font-size: 17px; }
.journey li p { margin: 9px 0 0; color: var(--muted); font-size: 13px; line-height: 1.7; }
.honor-modal { position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(2, 8, 8, .94); }
.honor-dialog { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; width: min(1100px, 100%); height: min(860px, 100%); min-height: 0; border: 1px solid #5cf5df; color: #f2faf6; background: #111b19; box-shadow: 0 0 36px rgba(92, 245, 223, .13); }
.honor-dialog-top, .honor-dialog-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 22px; }
.honor-dialog-top { border-bottom: 1px solid #344442; }
.honor-dialog-bottom { border-top: 1px solid #344442; }
.honor-dialog-top > div { min-width: 0; }
.honor-dialog-top span { color: #5cf5df; font-size: 12px; font-weight: 700; }
.honor-dialog-top h2 { margin: 5px 0 0; font-size: 20px; line-height: 1.35; overflow-wrap: anywhere; }
.honor-close, .honor-dialog-actions button { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid #5a746d; color: #f2faf6; background: #1d2927; cursor: pointer; }
.honor-close:hover, .honor-dialog-actions button:hover { border-color: #dcff63; color: #101514; background: #dcff63; }
.honor-close:focus-visible, .honor-dialog-actions button:focus-visible { outline: 2px solid #dcff63; outline-offset: 2px; }
.honor-viewer { display: grid; place-items: center; min-height: 0; overflow: hidden; background: #090e0d; }
.honor-viewer img { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; }
.honor-dialog-bottom p { display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; min-width: 0; margin: 0; font-size: 13px; }
.honor-dialog-bottom p strong { color: #dcff63; white-space: nowrap; }
.honor-dialog-bottom p span { color: #afc1bb; }
.honor-dialog-actions { display: flex; align-items: center; gap: 8px; }
.honor-position { min-width: 50px; margin-right: 8px; color: #afc1bb; font-size: 12px; text-align: right; white-space: nowrap; }
@media (max-width: 900px) {
  .honors-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .journey ol { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .honors-section { padding: 76px 16px; }
  .honors-heading { display: block; margin-bottom: 30px; }
  .honors-heading h2 { font-size: 38px; }
  .honors-heading > p { margin: 18px 0 0; }
  .honors-toolbar { display: block; }
  .honors-controls { margin-top: 18px; }
  .honors-search { flex: 1; width: auto; }
  .honors-controls select { min-width: 116px; }
  .honors-grid { grid-template-columns: 1fr; gap: 30px; }
  .journey { margin-top: 70px; }
  .journey ol { grid-template-columns: 1fr 1fr; gap: 16px; }
  .journey-heading h3 { font-size: 25px; }
  .honor-modal { padding: 10px; }
  .honor-dialog { height: 100%; }
  .honor-dialog-top, .honor-dialog-bottom { padding: 12px; }
  .honor-dialog-top h2 { font-size: 16px; }
}
</style>
