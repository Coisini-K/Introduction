<script setup>
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
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

const menuOpen = ref(false)
const scrolled = ref(false)

const navItems = [
  { label: '经历', href: '#experience' },
  { label: '项目', href: '#projects' },
  { label: '技能', href: '#skills' },
  { label: '荣誉', href: '#awards' },
  { label: '关于我', href: '#about' },
]

const projects = [
  {
    period: '2026.05 - 2026.08',
    name: 'SupplyMind',
    subtitle: '供应链一体化智能管理平台',
    description:
      '面向制造、流通企业的 AI 供应链协同平台，支持自然语言驱动的需求预测、补货、供应商比价、物流调度与风险预警。',
    highlights: [
      '使用 FastAPI、SQLAlchemy 与 JWT 构建服务和权限体系',
      '以多智能体编排和 A2A 消息总线串联供应链业务',
      '集成 ECharts 数据可视化与 OR-Tools 路径优化',
    ],
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'ECharts', 'OR-Tools', 'A2A'],
    url: 'http://47.114.78.100/',
  },
  {
    period: '2026.03 - 2026.06',
    name: '智慧交通应急车辆调度平台',
    subtitle: '智能派单与任务全生命周期管理',
    description:
      '面向应急车辆调度场景，打通车辆审核、任务派发、路径规划、轨迹追踪和任务处置闭环。',
    highlights: [
      '采用业务规则与任务状态机实现智能派单',
      '接入腾讯地图 API，实现路径规划与绿色通道管控',
      '覆盖管理端、业务服务与微信小程序',
    ],
    stack: ['Spring Boot', 'MyBatis-Plus', 'MySQL', 'Vue 2', '微信小程序'],
    url: 'http://8.138.45.255/',
  },
  {
    period: '2026.02 - 2026.05',
    name: '焊接缺陷检测及质量诊断系统',
    subtitle: 'YOLO 视觉检测与多智能体协同',
    description:
      '从焊缝缺陷识别延伸至缺陷判级、根因分析、知识检索和返修工单生成，形成质量诊断闭环。',
    highlights: [
      '使用 YOLOv8、OpenCV 完成缺陷识别和尺寸测量',
      '基于 LangGraph、LangChain 构建多智能体工作流',
      '结合 RAG、Milvus/FAISS、主动学习与 MLOps 持续迭代',
    ],
    stack: ['YOLOv8', 'OpenCV', 'LangGraph', 'RAG', 'Milvus', 'MLOps'],
    url: 'http://47.114.98.241/',
  },
]

const skillGroups = [
  {
    title: '后端与数据',
    items: ['Java / Spring Boot', 'Python / FastAPI', 'MySQL / Oracle', 'MongoDB / Redis', 'SQL 调优与索引优化'],
  },
  {
    title: '前端与工程化',
    items: ['Vue / TypeScript', 'Vite / Webpack', 'Element UI', 'Node.js', '微信小程序'],
  },
  {
    title: 'AI 工程',
    items: ['LLM / Agent', 'Spring AI', 'RAG 检索增强', 'YOLO 目标检测', 'LangChain / LangGraph'],
  },
  {
    title: '平台与协作',
    items: ['GitHub / Gitee', '阿里云 / 宝塔', 'Nginx', 'RabbitMQ / Dubbo', 'TCP/IP 网络排查'],
  },
]

const awards = [
  {
    title: '第六届传智杯全国 IT 技能大赛',
    detail: '云计算大数据赛道 · 一等奖',
    note: '完成云平台搭建与数据处理开发',
  },
  {
    title: '第五届全国大学生技术创新创业大赛',
    detail: 'AI 大模型应用赛道全国赛 · 二等奖',
    note: '担任项目队长，统筹项目并完成核心功能研发',
  },
  {
    title: '未来设计师全国高校数字艺术设计大赛',
    detail: '全国赛 · 三等奖',
    note: '承担交互与界面设计工作',
  },
]

const experience = [
  '协同项目负责人对接客户，基于埋点、工单与用户调研拆解需求，梳理核心流程痛点并输出交互方案。',
  '从 0 到 1 开发可复用的新手引导组件，包括弹窗、步骤高亮和视频浮窗，独立完成打包部署。',
  '设计三层引导方案，将用户上手时长压缩至 3 分钟，操作失误率下降 62%，首周留存提升 28%。',
  '搭建用户反馈闭环，每周采集 500+ 条反馈，推动模块使用率提升 35%，满意度由 7.2 分提升至 8.9 分。',
  '开发 FAQ 自助问答模块，实现 60% 问题即时自助处理，平台满意度由 81% 提升至 92%。',
]

const resumeUrl = `${import.meta.env.BASE_URL}黄钶卿-个人简历.pdf`

function closeMenu() {
  menuOpen.value = false
}

function updateScrollState() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })

  if (window.location.hash) {
    nextTick(() => {
      const target = document.querySelector(window.location.hash)
      if (target) window.setTimeout(() => target.scrollIntoView(), 0)
    })
  }
})

onUnmounted(() => window.removeEventListener('scroll', updateScrollState))
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <a class="wordmark" href="#top" aria-label="返回顶部" @click="closeMenu">
      <span>HKQ</span>
      <span class="wordmark-name">黄钶卿</span>
    </a>

    <nav class="desktop-nav" aria-label="主要导航">
      <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
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
      <a v-for="item in navItems" :key="item.href" :href="item.href" @click="closeMenu">{{ item.label }}</a>
      <a :href="resumeUrl" download @click="closeMenu">下载简历</a>
    </nav>
  </header>

  <main id="top">
    <section class="intro" aria-labelledby="intro-title">
      <div class="intro-inner">
        <div class="intro-copy">
          <p class="eyebrow"><span></span> 软件工程 · AI 应用开发</p>
          <h1 id="intro-title">黄钶卿</h1>
          <p class="intro-lead">把复杂业务拆成能上线、可衡量、可持续迭代的软件产品。</p>
          <p class="intro-summary">
            软件工程本科应届毕业生，关注全栈开发与 AI 工程落地。具备从需求分析、系统设计到部署维护的完整项目经验。
          </p>

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

        <div class="portrait-wrap">
          <div class="portrait-accent" aria-hidden="true"></div>
          <img :src="profileImage" alt="黄钶卿个人照片" />
          <div class="portrait-caption">
            <span>广东科技学院</span>
            <strong>软件工程 · 本科</strong>
          </div>
        </div>
      </div>
    </section>

    <section id="experience" class="section experience-section" aria-labelledby="experience-title">
      <div class="section-heading">
        <p class="section-kicker"><BriefcaseBusiness :size="17" /> Experience</p>
        <h2 id="experience-title">工作经历</h2>
      </div>

      <div class="experience-layout">
        <div class="experience-meta">
          <p>2025.03 - 2025.06</p>
          <h3>广州晒展科技有限公司</h3>
          <span>程序员</span>
        </div>
        <ol class="achievement-list">
          <li v-for="item in experience" :key="item">
            <CheckCircle2 :size="19" />
            <span>{{ item }}</span>
          </li>
        </ol>
      </div>
    </section>

    <section id="projects" class="section projects-section" aria-labelledby="projects-title">
      <div class="section-heading projects-heading">
        <div>
          <p class="section-kicker"><Code2 :size="17" /> Selected Work</p>
          <h2 id="projects-title">项目经验</h2>
        </div>
        <p>覆盖企业业务系统、智能调度与计算机视觉，均完成端到端工程实现。</p>
      </div>

      <div class="project-list">
        <article v-for="(project, index) in projects" :key="project.name" class="project-card">
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
      <div class="section-heading">
        <p class="section-kicker"><Sparkles :size="17" /> Capabilities</p>
        <h2 id="skills-title">专业技能</h2>
      </div>

      <div class="skills-grid">
        <article v-for="(group, index) in skillGroups" :key="group.title" class="skill-group">
          <span class="skill-number">0{{ index + 1 }}</span>
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="awards" class="section awards-section" aria-labelledby="awards-title">
      <div class="section-heading awards-heading">
        <div>
          <p class="section-kicker"><Award :size="17" /> Recognition</p>
          <h2 id="awards-title">荣誉证书</h2>
        </div>
        <a href="https://coisini-k.github.io/WallFame/" target="_blank" rel="noreferrer">
          查看全部荣誉 <ArrowUpRight :size="17" />
        </a>
      </div>

      <div class="award-list">
        <article v-for="award in awards" :key="award.title" class="award-item">
          <Award :size="25" />
          <div>
            <h3>{{ award.title }}</h3>
            <strong>{{ award.detail }}</strong>
            <p>{{ award.note }}</p>
          </div>
        </article>
      </div>
      <p class="award-summary">大学期间获得 4 项省赛奖与 7 项国赛奖，多次担任项目负责人并带领团队完成技术攻关。</p>
    </section>

    <section id="about" class="section about-section" aria-labelledby="about-title">
      <div class="about-heading">
        <p class="section-kicker"><UserRound :size="17" /> About</p>
        <h2 id="about-title">持续学习，也持续交付。</h2>
      </div>
      <div class="about-copy">
        <p>多次担任项目负责人，具备项目协作与技术推进经验，曾获校级优秀奖学金、优秀团干部等荣誉。</p>
        <p>大一学年绩点位列年级第二，多门专业课 95 分以上。擅长阅读官方文档，并借助 GitHub 与 AI 工具自主定位和解决问题。</p>
        <p>开发过网站、小程序、后台与代码工具，持续关注 AI 大模型相关技术，能够理解业务需求并将其落实为可运行的软件。</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div>
      <strong>黄钶卿</strong>
      <span>软件工程与 AI 应用开发</span>
    </div>
    <a href="mailto:2696897728@qq.com">一起聊聊 <ArrowUpRight :size="17" /></a>
  </footer>
</template>
