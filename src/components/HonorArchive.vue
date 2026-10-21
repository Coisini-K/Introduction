<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowUpRight, Award, ChevronLeft, ChevronRight, Search, X } from '@lucide/vue'
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
let previousFocus = null
let previousOverflow = ''

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
  if (!filteredHonors.value.length) return
  const next = (activeIndex.value + direction + filteredHonors.value.length) % filteredHonors.value.length
  activeHonor.value = filteredHonors.value[next]
}

function onKeydown(event) {
  if (!activeHonor.value) return
  if (event.key === 'Escape') closeHonor()
  if (event.key === 'ArrowLeft') move(-1)
  if (event.key === 'ArrowRight') move(1)
}

watch(activeHonor, (honor) => {
  if (honor) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousOverflow
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
      <div class="honors-heading">
        <div>
          <p class="section-kicker"><Award :size="17" /> Recognition</p>
          <h2 id="awards-title">荣誉档案</h2>
        </div>
        <p>从校园实践到全国赛事，记录每一次认真投入与持续精进。</p>
      </div>

      <div class="honors-toolbar">
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
        <button v-for="honor in filteredHonors" :key="honor.id" class="honor-card" type="button" :aria-label="`查看${honor.title}证书`" @click="openHonor(honor, $event)">
          <span class="honor-image">
            <img :src="coverUrl(honor)" :alt="`${honor.title}证书缩略图`" loading="lazy" />
            <span class="honor-open"><ArrowUpRight :size="20" aria-hidden="true" /></span>
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

      <div class="journey">
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

  <div v-if="activeHonor" class="honor-modal" role="dialog" aria-modal="true" :aria-label="activeHonor.title" @click.self="closeHonor">
    <div class="honor-dialog">
      <div class="honor-dialog-top">
        <div><span>{{ activeHonor.year }} · {{ activeHonor.category }}</span><h2>{{ activeHonor.title }}</h2></div>
        <button ref="closeButton" type="button" class="honor-close" aria-label="关闭证书预览" title="关闭" @click="closeHonor"><X :size="23" /></button>
      </div>
      <div class="honor-viewer">
        <img :src="coverUrl(activeHonor)" :alt="`${activeHonor.title}证书预览`" />
      </div>
      <div class="honor-dialog-bottom">
        <div class="honor-dialog-detail"><strong>{{ activeHonor.level }}</strong><span>{{ activeHonor.subtitle }}</span></div>
        <div class="honor-dialog-actions">
          <a :href="assetUrl(activeHonor.file)" target="_blank" rel="noopener noreferrer">查看原件 <ArrowUpRight :size="17" /></a>
          <button type="button" aria-label="上一项荣誉" title="上一项" @click="move(-1)"><ChevronLeft :size="21" /></button>
          <button type="button" aria-label="下一项荣誉" title="下一项" @click="move(1)"><ChevronRight :size="21" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.honors-section {
  scroll-margin-top: 72px;
  padding: 104px max(24px, calc((100vw - 1160px) / 2));
  background: #edf3f1;
}

.honors-inner { max-width: 1160px; margin: 0 auto; }
.honors-heading { display: flex; align-items: end; justify-content: space-between; gap: 40px; margin-bottom: 42px; }
.honors-heading h2 { margin: 0; font-size: clamp(38px, 5vw, 62px); line-height: 1.1; }
.honors-heading > p { max-width: 390px; margin: 0 0 4px; color: var(--muted); font-size: 15px; line-height: 1.8; }
.honors-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 20px 0; border-top: 2px solid var(--ink); border-bottom: 1px solid #c7d2cf; }
.honors-toolbar > p { display: flex; align-items: baseline; gap: 10px; margin: 0; white-space: nowrap; }
.honors-toolbar > p strong { color: var(--teal); font-size: 31px; line-height: 1; }
.honors-toolbar > p span { color: #53625d; font-size: 13px; }
.honors-controls { display: flex; gap: 10px; }
.honors-search { display: flex; align-items: center; gap: 10px; width: min(360px, 36vw); height: 44px; padding: 0 13px; border: 1px solid #b9c8c3; background: #fff; color: var(--teal); }
.honors-search:focus-within, .honors-controls select:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.honors-search input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font: inherit; font-size: 14px; }
.honors-search input::placeholder { color: #84908c; }
.honors-controls select { min-width: 135px; height: 44px; padding: 0 12px; border: 1px solid #b9c8c3; border-radius: 0; color: var(--ink); background: #fff; font: inherit; font-size: 14px; cursor: pointer; }
.honors-count { margin: 22px 0 19px; color: #677671; font-size: 13px; }
.honors-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px 24px; }
.honor-card { display: block; min-width: 0; padding: 0 0 20px; border: 0; border-bottom: 1px solid #c7d2cf; color: var(--ink); background: transparent; text-align: left; font: inherit; cursor: pointer; }
.honor-card:focus-visible { outline: 2px solid var(--teal); outline-offset: 5px; }
.honor-image { position: relative; display: block; overflow: hidden; width: 100%; aspect-ratio: 4 / 3; background: #dce5e1; }
.honor-image img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 200ms ease; }
.honor-card:hover .honor-image img, .honor-card:focus-visible .honor-image img { transform: scale(1.035); }
.honor-open { position: absolute; right: 12px; bottom: 12px; display: grid; place-items: center; width: 38px; height: 38px; color: var(--teal); background: #fff; }
.honor-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 15px 0 9px; color: #66746f; font-size: 12px; }
.honor-meta strong { flex: none; padding: 4px 7px; border: 1px solid #b6cbc4; color: var(--teal); font-size: 11px; font-weight: 700; }
.honor-title { display: block; font-size: 18px; font-weight: 750; line-height: 1.45; overflow-wrap: anywhere; }
.honor-subtitle { display: block; margin-top: 7px; color: #697773; font-size: 13px; line-height: 1.5; }
.honors-empty { display: grid; justify-items: center; gap: 10px; padding: 80px 20px; border-bottom: 1px solid #c7d2cf; color: var(--muted); }
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
.honor-modal { position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: 28px; background: rgba(13, 22, 20, .9); }
.honor-dialog { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; width: min(1100px, 100%); height: min(820px, 100%); min-height: 0; background: #f7f8f6; }
.honor-dialog-top, .honor-dialog-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 24px; }
.honor-dialog-top > div { min-width: 0; }
.honor-dialog-top span { color: var(--teal); font-size: 12px; font-weight: 700; }
.honor-dialog-top h2 { margin: 5px 0 0; font-size: 20px; line-height: 1.35; }
.honor-close, .honor-dialog-actions button { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid #b9c8c3; color: var(--ink); background: #fff; cursor: pointer; }
.honor-close:hover, .honor-dialog-actions button:hover { border-color: var(--teal); color: var(--teal); }
.honor-viewer { display: grid; place-items: center; min-height: 0; overflow: hidden; background: #172321; }
.honor-viewer img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; }
.honor-dialog-detail { display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; min-width: 0; font-size: 13px; }
.honor-dialog-detail strong { color: var(--teal); white-space: nowrap; }
.honor-dialog-detail span { color: var(--muted); }
.honor-dialog-actions { display: flex; align-items: center; gap: 8px; }
.honor-dialog-actions a { display: inline-flex; align-items: center; gap: 6px; margin-right: 8px; color: var(--teal); font-size: 13px; font-weight: 700; white-space: nowrap; }
.honor-dialog-actions a:hover { text-decoration: underline; }

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
  .honor-dialog { height: min(100%, 760px); }
  .honor-dialog-top, .honor-dialog-bottom { padding: 12px; }
  .honor-dialog-top h2 { font-size: 16px; }
  .honor-dialog-bottom { flex-wrap: wrap; }
  .honor-dialog-actions { width: 100%; justify-content: space-between; }
}
</style>
