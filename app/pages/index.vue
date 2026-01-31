<template>
  <div class="resume-page">
    <!-- About/Hero Section -->
    <ResumeHeader />

    <!-- Brief Introduction -->
    <AboutSection />

    <!-- Projects Section -->
    <section id="projects" class="py-16 px-4 bg-slate-100">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">项目经验</h2>
          <p class="text-gray-600">精选项目展示我的技术能力和实践经验</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <!-- Sound-Flow Project -->
          <ProjectCard
            :project="{
              name: 'Sound-Flow 在线音乐播放平台',
              role: '前端 + BaaS (Firebase)',
              techStack: ['Vue 3', 'Pinia', 'Vue Router', 'Vite', 'Firebase', 'ESLint', 'Prettier'],
              description: '精美的播放控件，支持用户创建个人歌单、上传音乐文件、云端存储，适配桌面端和移动端设备。',
              highlights: [
                '基于 Vue 3 + Pinia 维护全局播放状态，封装 OptimizedImage 组件，通过 CDN 参数动态请求不同尺寸图片，降低首屏资源消耗',
                'Firebase 集成：Authentication 实现邮箱注册登录；Firestore 存储歌单与用户数据；Storage 实现音乐文件与封面图片的云端上传与下载',
                '编写 Firebase 安全规则，限制读写；对上传文件设置类型限制与大小限制（音频 < 15MB、图片 < 10MB），有效防止恶意文件上传',
                '图片 CDN 加速：首屏加载时间从 3s 优化到 1.2s',
                '代码分割：利用 Vite 的 manualChunks 分离 Firebase SDK，结合 Gzip 压缩，使首屏初始加载体积减少约 40%'
              ],
              githubUrl: 'https://github.com/EafenQAQ/Sound-Flow',
              demoUrl: 'https://sound-flow-e1a34.web.app/'
            }"
          />

          <!-- MindFree AI Project -->
          <ProjectCard
            :project="{
              name: 'MindFree AI 心理咨询聊天应用',
              role: '前端 + BaaS (Supabase) + GLM-4.7',
              techStack: ['Vue 3', 'Pinia', 'Vue Router', 'Supabase', 'GLM-4.7', 'Tailwind CSS 4.0', 'DaisyUI', 'Anime.js'],
              description: '支持用户注册登录、多会话管理、智能对话交互。人本主义心理咨询师角色，帮助用户深入理解自己的感受和需求，适配桌面端和移动端。',
              highlights: [
                'AI 模型集成：GLM-4.7 模型，通过精心设计的系统提示词实现人本主义心理咨询师角色，提供专业对话服务',
                '针对生产环境构建 Netlify Functions 代理层，将 API Key 隐藏在服务端，通过 Axios 双实例封装实现开发与生产环境无缝切换，规避前端密钥泄露风险',
                'Supabase 集成：使用 Supabase 实现用户认证，通过 Pinia Store 持久化用户登录状态'
              ],
              githubUrl: 'https://github.com/EafenQAQ/mindFree',
              demoUrl: 'https://mindfree-ai.netlify.app/'
            }"
          />

          <!-- Cat-Paw-Blog Project -->
          <ProjectCard
            :project="{
              name: 'Cat-Paw-Blog 零人工干预自动产出内容',
              role: 'Make.com 自动化工作流 + Notion + Netlify Functions + 前端',
              techStack: ['Vue 3', 'Vue Router', 'Notion', 'Make.com'],
              description: '基于 Vue 3 + Notion 的自动化博客网页，构建了一套从抓取、翻译到发布的全自动内容管线，实现网站内容每日静默更新。',
              highlights: [
                'Make.com 自动化流水线：利用 Make.com 搭建工作流，实现每日定时从海外 RSS 源抓取内容，经 AI 智能体自动翻译润色后，通过 API 实时同步至 Notion 数据库',
                '中间层转发：通过 Netlify Function 实现代理转发，解决了客户端直接向 Notion 请求数据产生的 CORS 跨域限制',
                '使用 Netlify Functions 搭建后端代理，封装数据库查询、标签过滤及分页加载逻辑，保障 API Key 的服务端安全',
                '无限滚动加载：利用 Intersection Observer API 监听 DOM 状态，结合 Notion 的 start_cursor 游标机制实现高性能的长列表分页',
                '标签云与筛选系统：实现动态标签云组件，自动聚合所有文章标签，点击标签跳转至筛选页面，通过路由参数传递标签信息'
              ],
              githubUrl: 'https://github.com/EafenQAQ/vue-Blog',
              demoUrl: 'https://cat-paw-blog.netlify.app/'
            }"
          />
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">开发技能</h2>
          <p class="text-gray-600">全栈前端开发技能矩阵</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillSection
            category="JavaScript / TypeScript"
            :skills="['ES6+ 新特性', '原型链', '作用域', '手写 Promise', 'TypeScript 类型系统', 'Interface 与泛型']"
            icon="mdi:language-javascript"
          />

          <SkillSection
            category="HTML / CSS"
            :skills="['HTML5 语义化', '浏览器 Storage 技术', 'Flexbox', 'Grid', 'CSS 动画', '响应式设计']"
            icon="mdi:language-html5"
          />

          <SkillSection
            category="Vue 3 生态"
            :skills="['Composition API', '响应式系统', '生命周期', '组件通信', 'watch & computed', 'Pinia 状态管理', 'Vue Router 路由']"
            icon="logos:vue"
          />

          <SkillSection
            category="UI 框架"
            :skills="['Tailwind CSS', 'Bootstrap', 'Element Plus', 'Naive UI', 'DaisyUI', 'Nuxt UI']"
            icon="mdi:palette"
          />

          <SkillSection
            category="前端工程化"
            :skills="['Vite', 'Webpack', 'Git 工作流', 'npm/pnpm/yarn', 'ESLint', 'Prettier']"
            icon="mdi:toolbox"
          />

          <SkillSection
            category="性能优化"
            :skills="['代码分割', '分包策略', 'Gzip 压缩', 'CDN 加速', 'Lighthouse', 'Chrome DevTools']"
            icon="mdi:speedometer"
          />

          <SkillSection
            category="AI Coding"
            :skills="['Python 基础', 'Spec-Driven 开发', 'Claude Code', 'Cursor', 'Augment', 'Roo Code', 'Make.com 自动化']"
            icon="mdi:robot"
          />
        </div>
      </div>
    </section>

    <!-- Education & Evaluation Section -->
    <section id="education" class="py-16 px-4 bg-slate-100">
      <div class="max-w-4xl mx-auto space-y-8">
        <EducationSection />
        <SelfEvaluation />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: '高一帆 - 前端开发工程师简历',
  meta: [
    { name: 'description', content: '高一帆的个人简历网页，前端开发工程师，精通 Vue 3、Nuxt、TypeScript、TailwindCSS 等技术栈' },
    { name: 'keywords', content: '前端开发, Vue 3, Nuxt, TypeScript, TailwindCSS, 简历, 高一帆' },
    { property: 'og:title', content: '高一帆 - 前端开发工程师简历' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.resume-page {
  scroll-behavior: smooth;
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>