import type { ResumeContext, Project, SkillCategory, NavItem } from '~/types/resume'

export const resumeContext: ResumeContext = {
  name: '高一帆',
  role: 'Frontend Developer',
  contact: {
    phone: '158 4700 7426',
    email: '15847007426@163.com',
    wechat: 'e15847007426',
    location: '杭州',
    education: '济南大学 (应用心理学) 2019-2023',
  },
  intro: '从应用心理学跨界自学进入前端开发领域。自学期间阅读了 20+ 技术文档，创建了 23 个github库。具备独立从零构建全栈Demo应用的能力。',
  projects: [
    {
      name: 'Sound-Flow',
      stack: 'Vue 3, Pinia, Firebase',
      details: '在线音乐平台，CDN加速优化首屏，Firebase安全规则防止恶意上传。',
    },
    {
      name: 'MindFree AI',
      stack: 'Vue 3, Supabase, GLM-4.7',
      details: '心理咨询聊天应用，人本主义心理咨询师角色，Netlify Functions 代理隐藏 API Key。',
    },
    {
      name: 'Cat-Paw-Blog',
      stack: 'Make.com, Notion API, Vue 3',
      details: '全自动内容管线博客，每日静默更新，无限滚动加载。',
    },
  ],
  skills: [
    'Vue 3',
    'TypeScript',
    'Tailwind CSS',
    'Vite',
    'Firebase',
    'Supabase',
    'Node.js',
    'Python Scripting',
    'Prompt Engineering',
  ],
  highlights: 'AI-Native 开发模式，Spec-Driven 开发，同理心设计。',
}

export const projects: Project[] = [
  {
    title: 'Sound-Flow 音乐平台',
    subtitle: '前端 + BaaS (Firebase)',
    description: '一个精美的在线音乐播放平台，支持用户上传、创建歌单及云端同步。注重性能优化与数据安全。',
    icon: 'music',
    stack: ['Vue 3', 'Pinia', 'Vite', 'Firebase', 'Tailwind'],
    highlights: [
      '图片 CDN 加速与懒加载，首屏时间 3s → 1.2s',
      'Firebase 安全规则配置与域名白名单，防止恶意上传',
      '基于 Pinia 的全局播放状态管理',
    ],
    github: 'https://github.com/EafenQAQ/Sound-Flow',
    demo: 'https://sound-flow-e1a34.web.app/',
  },
  {
    title: 'MindFree AI 心理咨询',
    subtitle: '前端 + Supabase + GLM-4.7',
    description: '人本主义心理咨询聊天应用。结合心理学专业背景，打造有温度的 AI 对话体验。',
    icon: 'brain-circuit',
    stack: ['Vue 3', 'Supabase', 'GLM-4.7', 'DaisyUI', 'Anime.js'],
    highlights: [
      '精心设计的 System Prompt 实现人本主义咨询角色',
      'Netlify Functions 代理层隐藏 API Key，保障安全',
      'Supabase 认证与 Pinia 状态持久化',
    ],
    github: 'https://github.com/EafenQAQ/mindFree',
    demo: 'https://mindfree-ai.netlify.app/',
  },
  {
    title: 'Cat-Paw-Blog',
    subtitle: '全自动内容管线博客',
    description: '基于 Make.com 自动化工作流，从抓取、AI翻译润色到 Notion 发布的零人工干预内容系统。',
    icon: 'rss',
    stack: ['Vue 3', 'Notion API', 'Make.com', 'Netlify Functions'],
    highlights: [
      '构建自动化流水线，每日静默更新海外资讯',
      '无限滚动加载与标签云筛选系统',
      'Netlify Functions 解决 Notion API 跨域问题',
    ],
    github: 'https://github.com/EafenQAQ/vue-Blog',
    demo: 'https://cat-paw-blog.netlify.app/',
  },
]

export const skills: SkillCategory[] = [
  {
    title: 'Vue Ecosystem',
    icon: 'layout',
    items: [
      'Vue 3 Composition API',
      'Pinia Store',
      'Vue Router',
      'Nuxt',
      'LifeCycle',
    ],
  },
  {
    title: 'Core Frontend',
    icon: 'code',
    items: [
      'JavaScript (ES6+)',
      'TypeScript',
      'HTML5/Semantic',
      'CSS3',
      'Promise/Async',
    ],
  },
  {
    title: 'UI & Styling',
    icon: 'palette',
    items: [
      'Tailwind CSS',
      'DaisyUI',
      'Element Plus',
      'Naive UI',
      'Responsive Design',
    ],
  },
  {
    title: 'Engineering',
    icon: 'cpu',
    items: [
      'Vite',
      'Webpack',
      'Git Workflow',
      'npm/pnpm',
      'Lighthouse Optimization',
    ],
  },
]

export const navItems: NavItem[] = [
  { name: '关于我', href: '#about' },
  { name: '项目经验', href: '#projects' },
  { name: '技能栈', href: '#skills' },
  { name: '教育经历', href: '#education' },
]
