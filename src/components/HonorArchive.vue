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
        <button v-for="honor in filteredHonors" :key="honor.id" class="honor-card" data-interactive type="button" :aria-label="`查看${honor.title}证书原件`" @click="openHonor(honor, $event)">
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

  <Teleport to="body">
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
  </Teleport>
</template>

<style scoped>
.honors-section { position: relative; width: var(--content); margin: 0 auto; padding: 95px 0; border-top: 1px solid var(--line); scroll-margin-top: 0; }
.honors-inner { max-width: 1160px; margin: 0 auto; }
.honors-heading { display: flex; align-items: end; justify-content: space-between; gap: 40px; margin-bottom: 39px; }
.honors-heading h2 { margin: 0; color: var(--ink); font-size: clamp(34px, 3.6vw, 50px); font-weight: 750; letter-spacing: -1.8px; line-height: 1.2; text-shadow: 0 0 24px #9bdfff14; }
.honors-heading h2::after { display: inline-block; width: 7px; height: 7px; margin-left: 14px; background: var(--acid); box-shadow: 0 0 11px #c5f88b70; content: ''; }
.honors-heading > p { max-width: 370px; margin: 0 0 4px; color: var(--muted); font-size: 13px; line-height: 1.9; }
.honors-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 22px 0; border-top: 1px solid #a2cad65c; border-bottom: 1px solid var(--line); }
.honors-toolbar > p { display: flex; align-items: baseline; gap: 12px; margin: 0; white-space: nowrap; }
.honors-toolbar > p strong { color: #8de1ed; font: 31px/1 Consolas, monospace; }
.honors-toolbar > p span { color: var(--muted); font-size: 12px; }
.honors-controls { display: flex; gap: 10px; }
.honors-search { display: flex; align-items: center; gap: 10px; width: min(330px, 34vw); height: 42px; padding: 0 13px; border: 1px solid #6baac640; border-radius: 3px; background: #0f22378c; color: #7bc7d7; }
.honors-search:focus-within, .honors-controls select:focus-visible { outline: 1px solid var(--teal); outline-offset: 2px; }
.honors-search input { min-width: 0; width: 100%; border: 0; outline: 0; color: #d8e9f5; background: transparent; font: inherit; font-size: 12px; }
.honors-search input::placeholder { color: #7793ad; }
.honors-controls select { min-width: 125px; height: 42px; padding: 0 12px; border: 1px solid #6baac640; border-radius: 3px; color: #b7d6e5; background: #0c1c30; font: inherit; font-size: 12px; cursor: pointer; }
.honors-count { margin: 23px 0 19px; color: #7d97b2; font: 11px Consolas, "Microsoft YaHei", monospace; }
.honors-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.honor-card { display: block; min-width: 0; overflow: hidden; padding: 0 0 21px; border: 1px solid #6babc62e; border-radius: 3px; color: var(--ink); background: linear-gradient(140deg, #13273e99, #0d1b2f99); text-align: left; font: inherit; cursor: pointer; transition: border-color 220ms, transform 220ms, box-shadow 220ms; }
.honor-card:hover { transform: translateY(-4px); border-color: #65e7f677; box-shadow: 0 8px 28px #209bce17; }
.honor-card:focus-visible { outline: 2px solid var(--teal); outline-offset: 5px; }
.honor-image { position: relative; display: block; overflow: hidden; width: 100%; aspect-ratio: 4 / 3; border-bottom: 1px solid var(--line); background: #101d2d; }
.honor-image::after { position: absolute; inset: 0; background: linear-gradient(transparent 70%, #07142633); content: ''; pointer-events: none; }
.honor-image img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 350ms; }
.honor-card:hover .honor-image img, .honor-card:focus-visible .honor-image img { transform: scale(1.035); }
.honor-open { position: absolute; z-index: 1; right: 12px; bottom: 12px; display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid #a7f1f3aa; border-radius: 2px; color: #b7f6fa; background: #0b253de0; box-shadow: 0 0 12px #65e7f629; }
.honor-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 17px 17px 12px; color: #7f9db8; font-size: 10px; }
.honor-meta strong { flex: none; padding: 4px 7px; border: 1px solid #65e7f638; border-radius: 2px; color: #88dbe5; background: #65e7f609; font-size: 10px; font-weight: 500; }
.honor-title { display: block; margin: 0 17px; color: #d8e9f6; font-size: 15px; font-weight: 600; line-height: 1.65; overflow-wrap: anywhere; }
.honor-subtitle { display: block; margin: 8px 17px 0; color: #839db7; font-size: 11px; line-height: 1.7; }
.honors-empty { display: grid; justify-items: center; gap: 10px; padding: 80px 20px; border-bottom: 1px solid var(--line); color: var(--muted); }
.honors-empty p { margin: 0; }
.honors-empty button { padding: 6px 0; border: 0; border-bottom: 1px solid var(--teal); color: var(--teal); background: none; font: inherit; cursor: pointer; }
.journey { margin-top: 74px; padding: 28px; border: 1px solid var(--line); border-radius: 3px; background: linear-gradient(120deg, #0e243980, #18172d33); }
.journey-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; border-bottom: 1px solid #7eb4c14d; }
.journey-heading h3 { margin: 0 0 23px; color: #def0fb; font-size: 24px; font-weight: 600; }
.journey-heading > span { color: #729eb6; font: 11px Consolas, monospace; letter-spacing: 1px; }
.journey ol { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px; margin: 0; padding: 0; list-style: none; }
.journey li { position: relative; min-width: 0; padding-top: 25px; }
.journey li::before { position: absolute; top: -3px; left: 0; width: 5px; height: 5px; border: 1px solid #7addf0; background: #0c1c2f; box-shadow: 0 0 8px #65e7f644; content: ''; }
.journey li > span { display: block; margin-bottom: 14px; color: #b391dc; font: 12px Consolas, monospace; letter-spacing: 1px; }
.journey li strong { color: #cbdfea; font-size: 14px; font-weight: 600; }
.journey li p { margin: 10px 0 0; color: #869eb8; font-size: 12px; line-height: 1.9; }
.honor-modal { position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(2, 7, 17, .92); backdrop-filter: blur(12px); }
.honor-dialog { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; width: min(1100px, 100%); height: min(860px, 100%); min-height: 0; overflow: hidden; border: 1px solid #65e7f680; border-radius: 4px; color: #eff7ff; background: #0b1b2d; box-shadow: 0 0 50px #65e7f61a; }
.honor-dialog-top, .honor-dialog-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 22px; }
.honor-dialog-top { border-bottom: 1px solid var(--line); }
.honor-dialog-bottom { border-top: 1px solid var(--line); }
.honor-dialog-top > div { min-width: 0; }
.honor-dialog-top span { color: #88dbe5; font-size: 11px; }
.honor-dialog-top h2 { margin: 7px 0 0; font-size: 19px; font-weight: 600; line-height: 1.5; overflow-wrap: anywhere; }
.honor-close, .honor-dialog-actions button { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid #668fa966; border-radius: 3px; color: #b9e6ef; background: #142f48; cursor: pointer; }
.honor-close:hover, .honor-dialog-actions button:hover { border-color: #82edf3; color: #e3ffff; background: #22475c; }
.honor-close:focus-visible, .honor-dialog-actions button:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.honor-viewer { display: grid; place-items: center; min-height: 0; overflow: hidden; background: #040b16; }
.honor-viewer img { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; }
.honor-dialog-bottom p { display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; min-width: 0; margin: 0; font-size: 12px; }
.honor-dialog-bottom p strong { color: #bdeba0; white-space: nowrap; }
.honor-dialog-bottom p span { color: #9bb1c5; }
.honor-dialog-actions { display: flex; align-items: center; gap: 8px; }
.honor-position { min-width: 50px; margin-right: 8px; color: #9bb1c5; font: 11px Consolas, monospace; text-align: right; white-space: nowrap; }
@media (max-width: 900px) {
  .honors-section { padding: 75px 0; }
  .honors-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .honors-heading > p { max-width: 310px; font-size: 12px; }
  .journey ol { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 16px; }
  .journey li:nth-child(n + 3)::before { display: none; }
}
@media (max-width: 640px) {
  .honors-section { padding: 64px 0; scroll-margin-top: 24px; }
  .honors-heading { display: block; margin-bottom: 29px; }
  .honors-heading h2 { font-size: 33px; letter-spacing: -1.3px; }
  .honors-heading h2::after { width: 6px; height: 6px; margin-left: 10px; }
  .honors-heading > p { max-width: 100%; margin: 18px 0 0; }
  .honors-toolbar { display: block; }
  .honors-controls { margin-top: 21px; gap: 8px; }
  .honors-search { flex: 1; width: auto; gap: 7px; padding: 0 10px; }
  .honors-search input { font-size: 11px; }
  .honors-search svg { width: 15px; flex-shrink: 0; }
  .honors-controls select { min-width: 105px; max-width: 112px; padding: 0 8px; font-size: 11px; }
  .honors-grid { grid-template-columns: 1fr; gap: 20px; }
  .honor-title { font-size: 16px; }
  .journey { margin-top: 48px; padding: 23px 19px; }
  .journey ol { gap: 20px 16px; }
  .journey-heading h3 { font-size: 22px; }
  .journey li strong { font-size: 13px; }
  .journey li p { font-size: 11px; }
  .honor-modal { padding: 10px; }
  .honor-dialog { height: 100%; }
  .honor-dialog-top, .honor-dialog-bottom { padding: 13px; gap: 12px; }
  .honor-dialog-top h2 { font-size: 15px; }
  .honor-dialog-bottom { flex-wrap: wrap; }
  .honor-dialog-actions { margin-left: auto; }
}
</style>
