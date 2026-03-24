---
name: fade-in-animation
overview: 为网页各部分添加渐入动画效果，使用 Vue 自定义指令 + CSS 动画 + Intersection Observer 实现
todos:
  - id: create-directive
    content: 创建 fadeIn.ts 指令文件和 fadeIn.css 样式文件
    status: completed
  - id: register-directive
    content: 在 Nuxt 插件中注册全局指令
    status: completed
    dependencies:
      - create-directive
  - id: hero-animation
    content: 为 HeroSection 添加顺序渐入动画
    status: completed
    dependencies:
      - register-directive
  - id: skills-animation
    content: 为 SkillsSection 添加交错渐入动画
    status: completed
    dependencies:
      - register-directive
  - id: projects-animation
    content: 为 ProjectsSection 添加交错渐入动画
    status: completed
    dependencies:
      - register-directive
  - id: education-animation
    content: 为 EducationSection 添加渐入动画
    status: completed
    dependencies:
      - register-directive
  - id: contact-animation
    content: 为 ContactSection 添加渐入动画
    status: completed
    dependencies:
      - register-directive
---

## 产品概述

为个人简历网页添加渐入动画效果，提升用户体验和视觉吸引力。

## 核心功能

- Hero 页面按顺序渐入：头像 → 问候语 → 介绍语
- 其他 Section 在滚动进入视口时触发渐入动画
- 使用 Vue 自定义指令封装，实现声明式调用
- 基于 Intersection Observer API 实现滚动触发

## 技术栈

- 框架：Nuxt 4 + Vue 3.5
- 样式：Tailwind CSS 4.x
- 动画：CSS Keyframes + Intersection Observer API
- 指令封装：Vue Custom Directive

## 实现方案

### 核心思路

创建一个全局 Vue 自定义指令 `v-fade-in`，内部使用 Intersection Observer 监测元素进入视口，触发时添加 CSS 动画类。

### 指令设计

```typescript
// 用法示例
<div v-fade-in>默认渐入</div>
<div v-fade-in="{ delay: 200 }">延迟200ms渐入</div>
```

### CSS 动画

```css
.fade-in-enter {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 性能优化

- 使用 CSS transition 而非 animation，浏览器可优化
- Intersection Observer 的 `threshold: 0.1` 提前触发
- 元素进入视口后立即 unobserve，减少监听开销
- `will-change: opacity, transform` 开启 GPU 加速

## 目录结构

```
app/
├── directives/
│   └── fadeIn.ts        # [NEW] 渐入动画指令
├── assets/
│   └── css/
│       └── fadeIn.css  # [NEW] 渐入动画样式
└── components/
    ├── HeroSection.vue      # [MODIFY] 添加指令
    ├── SkillsSection.vue    # [MODIFY] 添加指令
    ├── ProjectsSection.vue  # [MODIFY] 添加指令
    ├── EducationSection.vue # [MODIFY] 添加指令
    └── ContactSection.vue   # [MODIFY] 添加指令
```

## 渐入顺序设计

| Section | 渐入元素 | 延迟 |
| --- | --- | --- |
| Hero | 头像 | 0ms |
| Hero | 问候语 | 150ms |
| Hero | 介绍语 | 300ms |
| Hero | 统计卡片 + 按钮 | 450ms |
| Skills | 标题分隔线 | 0ms |
| Skills | 技能卡片 (4个) | 100ms, 200ms, 300ms, 400ms |
| Skills | AI特殊区块 | 500ms |
| Projects | 标题分隔线 | 0ms |
| Projects | 项目卡片 | 100ms, 200ms, 300ms, 400ms |
| Education | 教育经历卡片 | 0ms |
| Education | 自我评价卡片 | 150ms |
| Contact | 标题分隔线 | 0ms |
| Contact | 联系方式卡片 | 100ms, 200ms, 300ms, 400ms |
| Contact | 社交链接 | 500ms |