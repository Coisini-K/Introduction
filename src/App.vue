<script setup>
import {
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  GitBranch,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  UserRound,
  X,
} from '@lucide/vue'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import profileImage from './assets/profile.png'
import HonorArchive from './components/HonorArchive.vue'
import BinaryBackdrop from './components/BinaryBackdrop.vue'
import HeroSignals from './components/HeroSignals.vue'
import ParticleField from './components/ParticleField.vue'
import { useInteractiveSurfaces } from './composables/useInteractiveSurfaces'

const menuOpen = ref(false)
const scrolled = ref(false)
const scrollProgress = ref(0)
const effectsEnabled = ref(true)
const activeSection = ref('')
useInteractiveSurfaces(effectsEnabled)
let revealObserver

const navItems = [
  { label: '教育', href: '#education' },
  { label: '工作', href: '#experience' },
  { label: '项目', href: '#projects' },
  { label: '技能', href: '#skills' },
  { label: '荣誉', href: '#awards' },
  { label: '自我评价', href: '#about' },
]

const education = [
  {
    period: '2025.09 - 2027.06',
    school: '广东科技学院',
    level: '本科 · 软件工程',
    details: [
      '本科阶段获第五届全国大学生技术创新创业大赛 AI 大模型应用赛道全国二等奖（任队长、统筹全栈开发）、第十一届全国应用型人才综合技能大赛 Web 前端开发二等奖、全国高校创新设计大赛东方设计奖二等奖。',
      '任班长兼生活委员、新生带班党员及暑期“三下乡”负责人，承担班级管理、新生引导与社会实践项目的策划落地。',
    ],
  },
  {
    period: '2022.09 - 2025.06',
    school: '广东科技学院',
    level: '专科 · 计算机应用技术',
    details: [
      '获第六届传智杯全国 IT 技能大赛云计算大数据赛道省一等奖、全国大学生智慧供应链创新创业挑战赛三等奖，并多次获得校级优秀二等奖学金。',
      '担任班级团支书，负责党团建设、青年大学习与班级思想引领，获评优秀学生共青团干部。',
    ],
  },
  {
    period: '2020.09 - 2022.09',
    school: '中国人民解放军部队',
    level: '服役 · 战士',
    details: [
      '曾获“体能王”“军事训练标兵”“内务整理标兵”等荣誉，在服役中形成纪律性、抗压能力与高效执行力。',
    ],
  },
]

const projects = [
  {
    period: '2026.05 - 2026.08',
    name: 'SupplyMind',
    subtitle: '多智能体驱动的供应链一体化智能管理平台',
    description:
      '以 Agent Orchestrator 为核心，面向制造与流通场景构建从自然语言任务到业务执行的协同平台。',
    highlights: [
      '拆分需求预测、补货、供应商比价、物流调度与风险预警 Agent，串联任务解析、规划、工具调用和结果汇总。',
      '设计 A2A 消息总线及统一 Agent Adapter，接入 Claude、Codex、Gemini，支持注册路由、上下文传递、异常重试与状态管理。',
      '将 FastAPI、SQLAlchemy、OR-Tools 与 ECharts 封装为 Agent 工具，并通过 JWT 隔离任务执行和业务数据访问权限。',
    ],
    stack: ['Python / FastAPI', 'SQLAlchemy', 'JWT', 'ECharts', 'OR-Tools', 'A2A', 'Agent Adapter'],
    url: 'http://47.114.78.100/',
  },
  {
    period: '2026.03 - 2026.06',
    name: '智慧交通应急车辆调度平台',
    subtitle: '任务状态机与应急调度闭环',
    description:
      '以任务状态机为调度决策内核，覆盖车辆审核、应急派单、任务处置与复核追溯。',
    highlights: [
      '将智能派单、路径规划、轨迹追踪和绿色通道管控封装为 Agent 可调用工具，支持事件触发式派单建议。',
      '通过业务规则与状态机校验 Agent 或人工生成的候选方案，经人工复核后下发，保证可解释与可追溯。',
      '集成腾讯地图 API，实现路径规划、车辆轨迹追踪和绿色通道管控。',
    ],
    stack: ['Spring Boot', 'MyBatis-Plus', 'MySQL', 'Vue 2', '微信小程序', '腾讯地图 API'],
    url: 'http://8.138.45.255/',
  },
  {
    period: '2026.02 - 2026.05',
    name: '焊接缺陷检测及质量诊断系统',
    subtitle: 'YOLO 视觉检测与多智能体协同',
    description:
      '基于 YOLO 与多智能体流程，将焊缝缺陷识别延伸到判级、根因分析、知识检索与返修工单生成。',
    highlights: [
      '以 LangGraph / LangChain 编排检测、判级、根因分析、知识检索和工单生成 Agent，形成质量诊断闭环。',
      '结合 YOLOv8 / OpenCV 测量缺陷，利用 RAG、Milvus / FAISS 与长短期记忆提供领域知识和上下文。',
      '引入人工复核、异常重试、主动学习与 MLOps，支持数据回流、模型发布和持续迭代。',
    ],
    stack: ['Spring Boot', 'FastAPI', 'Vue', 'YOLOv8', 'OpenCV', 'LangGraph', 'RAG', 'Milvus / FAISS'],
    url: 'http://47.114.98.241/',
  },
]

const skillGroups = [
  {
    title: '后端开发',
    items: ['Java / Spring Boot / Python', '并发编程、文件 IO 与异常处理', 'Lambda 集合处理与微信小程序开发'],
  },
  {
    title: 'AI 工程',
    items: ['LangChain / Ollama / Spring AI', 'RAG 检索增强与 Agent 搭建', 'LLM 环境部署与 YOLO 目标检测'],
  },
  {
    title: '前端技术',
    items: ['Vue / TypeScript / Element UI', 'Vite / Webpack / Node.js', 'UML 建模与复杂交互实现'],
  },
  {
    title: '数据库',
    items: ['MySQL / Oracle / MongoDB / Redis', 'SQL 调优、索引优化与分库分表', '缓存穿透、击穿和雪崩防护'],
  },
  {
    title: '中间件与网络',
    items: ['Nginx / Zookeeper / Dubbo / RabbitMQ', 'OSI / TCP/IP 网络基础', '服务联调与基础网络排查'],
  },
  {
    title: '工程与运维',
    items: ['GitHub / Gitee 与 Git 工作流', '阿里云 / 宝塔环境搭建', '项目部署、维护与团队协作'],
  },
]

const experience = [
  {
    title: 'AI 智能客服 Agent',
    detail: '主导前端交互到后端知识库的开发，使用 LLM 与 RAG 完成语义检索、多轮对话 Prompt 与工单工作流。60% 问题即时自助处理，平均解决时长缩短至 1.5 小时，平台满意度由 81% 提升至 92%。',
  },
  {
    title: '全栈数据闭环与业务重构',
    detail: '从零搭建前端埋点、后端分析 API 与数据库，周均处理 500+ 条多模态反馈；借助大模型聚类分析高频痛点，推动前端与作业提交流程优化，模块使用率提升 35%，满意度由 7.2 分提升至 8.9 分。',
  },
  {
    title: '组件化与工程部署',
    detail: '独立开发并部署新手引导组件，抽象弹窗、步骤高亮与视频浮窗，落地“弹窗 + 图文 + 视频”三层方案；用户上手时长压缩至 3 分钟，操作失误率下降 62%，首周留存提升 28%。',
  },
  {
    title: '需求对接与项目推进',
    detail: '作为项目协同负责人对接客户与业务方，基于埋点、工单和调研数据拆解需求，输出全栈技术方案，推动跨团队评审、联调与自测，保障系统上线。',
  },
]

const aboutPoints = [
  {
    title: '技术与学习力',
    detail: '大学成绩稳居班级前 5%，多门课程 98 分以上，连年获校级奖学金。技术栈覆盖前后端与 AI 大模型，善用官方文档、GitHub 和 AI 工具独立解决复杂问题。',
  },
  {
    title: '统筹与领导力',
    detail: '多次担任项目负责人，大学期间带队斩获 5 项省奖、7 项国奖。历任专科团支书、本科班长兼生活委员及新生带班党员，具备跨团队沟通与项目推进能力。',
  },
  {
    title: '责任感与服务意识',
    detail: '退役军人，曾获“优秀教官”称号。策划并落地暑期“三下乡”社会实践，积极参与心理健康协会等公益志愿活动，累计服务 250+ 小时。',
  },
]

const resumeUrl = `${import.meta.env.BASE_URL}黄钶卿-个人简历.pdf`

function closeMenu() {
  menuOpen.value = false
}

function updateScrollState() {
  scrolled.value = window.scrollY > 12
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
  let current = ''
  for (const item of navItems) {
    const section = document.getElementById(item.href.slice(1))
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.4) current = item.href
  }
  activeSection.value = current
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState, { passive: true })

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-ready')
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })
    document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))
  }

  if (window.location.hash) {
    nextTick(() => {
      const target = document.querySelector(window.location.hash)
      if (target) window.setTimeout(() => target.scrollIntoView(), 0)
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
  revealObserver?.disconnect()
  document.documentElement.classList.remove('motion-ready')
})
</script>

<template>
  <BinaryBackdrop :enabled="effectsEnabled" />
  <ParticleField :enabled="effectsEnabled" />
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <span class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }" aria-hidden="true"></span>
    <a class="wordmark" href="#top" aria-label="返回顶部" @click="closeMenu">
      <span>HKQ</span>
      <span class="wordmark-name">黄钶卿</span>
    </a>

    <nav class="desktop-nav" aria-label="主要导航">
      <a v-for="item in navItems" :key="item.href" :href="item.href" :aria-current="activeSection === item.href ? 'location' : undefined">{{ item.label }}</a>
    </nav>

    <a class="header-action" :href="resumeUrl" download>
      <Download :size="17" />
      <span>下载简历</span>
    </a>

    <button class="menu-button" type="button" aria-label="切换导航菜单" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
      <X v-if="menuOpen" :size="22" />
      <Menu v-else :size="22" />
    </button>

    <nav v-if="menuOpen" class="mobile-nav" aria-label="移动端导航">
      <a v-for="item in navItems" :key="item.href" :href="item.href" :aria-current="activeSection === item.href ? 'location' : undefined" @click="closeMenu">{{ item.label }}</a>
      <a :href="resumeUrl" download @click="closeMenu">下载简历</a>
    </nav>
  </header>

  <main id="top">
    <section class="intro" aria-labelledby="intro-title">
      <HeroSignals />
      <div class="code-backdrop" aria-hidden="true">
        <div class="code-backdrop-rail">
          <span>01&nbsp; // profile.ts</span>
          <span>02&nbsp; const focus = [</span>
          <span>03&nbsp; &nbsp; 'full-stack',</span>
          <span>04&nbsp; &nbsp; 'agent systems'</span>
          <span>05&nbsp; ]</span>
          <span>06&nbsp; export default focus</span>
        </div>
        <div class="code-backdrop-source">
          <div class="code-line"><span class="code-comment">// profile / systems.ts</span></div>
          <div class="code-line"><span class="code-pink">import</span> { <span class="code-cyan">build</span> } <span class="code-pink">from</span> <span class="code-lime">'./systems'</span></div>
          <div class="code-line"><span class="code-pink">const</span> <span class="code-cyan">engineer</span> = {</div>
          <div class="code-line code-indent">name: <span class="code-lime">'Huang Keqing'</span>,</div>
          <div class="code-line code-indent">focus: [<span class="code-lime">'full-stack'</span>, <span class="code-lime">'AI agents'</span>],</div>
          <div class="code-line code-indent">status: <span class="code-lime">'building'</span></div>
          <div class="code-line code-cursor">}</div>
        </div>
      </div>
      <div class="intro-inner">
        <span class="frame-corner frame-corner-top" aria-hidden="true"></span>
        <span class="frame-corner frame-corner-bottom" aria-hidden="true"></span>
        <div class="intro-copy" data-reveal>
          <p class="eyebrow"><span></span> Me_HCK <b>/</b> 全栈开发 / AI 应用</p>
          <h1 id="intro-title">黄钶卿</h1>
          <p class="intro-lead">从业务需求到 AI 应用，交付可运行的软件产品。</p>
          <p class="intro-summary">
            软件工程本科应届毕业生，具备全栈开发与智能应用落地经验，关注需求分析、系统设计、开发部署及持续迭代的完整链路。
          </p>
          <p class="intro-identities"><span>退役军人</span><span>中共预备党员</span><span>2027 届毕业生</span></p>

          <div class="intro-actions">
            <a class="primary-button" href="#projects">
              查看项目
              <ArrowUpRight :size="18" />
            </a>
            <a class="icon-button" href="https://github.com/coisini-k" target="_blank" rel="noreferrer" aria-label="访问 GitHub" title="GitHub">
              <GitBranch :size="20" />
            </a>
          </div>

          <div class="contact-list" aria-label="联系信息">
            <a href="mailto:2696897728@qq.com"><Mail :size="16" />2696897728@qq.com</a>
            <a href="tel:15207627357"><Phone :size="16" />152 0762 7357</a>
            <span><MapPin :size="16" />广东</span>
          </div>
        </div>

        <div class="portrait-wrap" data-reveal data-interactive>
          <div class="portrait-accent" aria-hidden="true"></div>
          <span class="portrait-coordinate" aria-hidden="true">PROFILE_01 / HKQ</span>
          <img :src="profileImage" alt="黄钶卿个人照片" />
          <div class="portrait-caption">
            <span>广东科技学院</span>
            <strong>软件工程 · 本科</strong>
          </div>
        </div>
      </div>
    </section>

    <section id="education" class="section education-section" aria-labelledby="education-title">
      <div class="section-heading">
        <p class="section-kicker"><GraduationCap :size="17" /> Education & Service</p>
        <h2 id="education-title">教育与服役经历</h2>
      </div>
      <div class="education-list">
        <article v-for="(item, index) in education" :key="item.period" class="education-item" data-reveal :style="{ '--reveal-delay': `${index * 70}ms` }">
          <p class="education-period">{{ item.period }}</p>
          <div class="education-body">
            <div class="education-title"><h3>{{ item.school }}</h3><span>{{ item.level }}</span></div>
            <ul><li v-for="detail in item.details" :key="detail">{{ detail }}</li></ul>
          </div>
        </article>
      </div>
    </section>

    <section id="experience" class="section experience-section" aria-labelledby="experience-title">
      <div class="section-heading" data-reveal>
        <p class="section-kicker"><BriefcaseBusiness :size="17" /> Experience</p>
        <h2 id="experience-title">工作经历</h2>
      </div>

      <div class="experience-layout" data-reveal>
        <div class="experience-meta">
          <p>2025.03 - 2025.06</p>
          <h3>广州晒展科技有限公司</h3>
          <span>全栈开发 · 智能应用方向</span>
        </div>
        <ol class="achievement-list">
          <li v-for="(item, index) in experience" :key="item.title">
            <span class="achievement-number">0{{ index + 1 }}</span>
            <div><h4>{{ item.title }}</h4><p>{{ item.detail }}</p></div>
          </li>
        </ol>
      </div>
    </section>

    <section id="projects" class="section projects-section" aria-labelledby="projects-title">
      <div class="section-heading projects-heading" data-reveal>
        <div>
          <p class="section-kicker"><Code2 :size="17" /> Selected Work</p>
          <h2 id="projects-title">项目经验</h2>
        </div>
        <p>从多智能体业务编排，到应急调度与视觉诊断，持续把复杂需求变成可运行的系统。</p>
      </div>

      <div class="project-list">
        <article v-for="(project, index) in projects" :key="project.name" class="project-card" data-reveal data-interactive>
          <div class="project-index">0{{ index + 1 }}</div>
          <div class="project-main">
            <p class="project-period">{{ project.period }}</p>
            <h3>{{ project.name }}</h3>
            <p class="project-subtitle">{{ project.subtitle }}</p>
            <p class="project-description">{{ project.description }}</p>
            <ul class="project-highlights">
              <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
            </ul>
            <div class="tag-list" aria-label="项目技术栈">
              <span v-for="item in project.stack" :key="item">{{ item }}</span>
            </div>
          </div>
          <a class="project-link" :href="project.url" target="_blank" rel="noreferrer" :aria-label="`访问${project.name}`" title="访问项目">
            <ArrowUpRight :size="22" />
          </a>
        </article>
      </div>
    </section>

    <section id="skills" class="section skills-section" aria-labelledby="skills-title">
      <div class="section-heading" data-reveal>
        <p class="section-kicker"><Sparkles :size="17" /> Capabilities</p>
        <h2 id="skills-title">专业技能</h2>
      </div>

      <div class="skills-grid">
        <article v-for="(group, index) in skillGroups" :key="group.title" class="skill-group" data-reveal data-interactive :style="{ '--reveal-delay': `${index % 3 * 65}ms` }">
          <span class="skill-number">0{{ index + 1 }}</span>
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <HonorArchive />

    <section id="about" class="section about-section" aria-labelledby="about-title">
      <div class="about-heading" data-reveal>
        <p class="section-kicker"><UserRound :size="17" /> About</p>
        <h2 id="about-title">自我评价</h2>
      </div>
      <div class="about-copy">
        <article v-for="item in aboutPoints" :key="item.title" data-reveal>
          <h3>{{ item.title }}</h3>
          <p>{{ item.detail }}</p>
        </article>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div>
      <strong>黄钶卿</strong>
      <span>Me_HCK · 全栈开发与 AI 应用</span>
    </div>
    <span class="footer-status"><i></i> 持续学习，持续构建。</span>
    <a href="mailto:2696897728@qq.com">一起聊聊 <ArrowUpRight :size="17" /></a>
  </footer>

  <aside class="utility-controls" aria-label="页面工具">
    <button class="effects-toggle" type="button" :aria-pressed="effectsEnabled" :aria-label="effectsEnabled ? '关闭动态效果' : '开启动态效果'" :title="effectsEnabled ? '关闭动态效果' : '开启动态效果'" @click="effectsEnabled = !effectsEnabled">
      <Sparkles :size="17" aria-hidden="true" />
      <span>{{ effectsEnabled ? '动效' : '静态' }}</span>
    </button>
    <a v-show="scrolled" class="back-to-top" href="#top" aria-label="返回页面顶部" title="返回顶部"><ArrowUp :size="18" aria-hidden="true" /></a>
  </aside>
</template>
