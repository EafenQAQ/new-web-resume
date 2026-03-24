---
name: hero-3d-animation
overview: 在 HeroSection 右侧添加 Three.js 3D 技术主题动画组件，包含代码块/终端元素的 3D 效果、粒子系统和鼠标交互
design:
  architecture:
    framework: vue
  styleKeywords:
    - Cyberpunk
    - Glassmorphism
    - Tech
    - Dark Theme
  fontSystem:
    fontFamily: system-ui
    heading:
      size: 32px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#6366f1"
      - "#14b8a6"
    background:
      - "#0f172a"
      - "#1e293b"
    text:
      - "#e2e8f0"
    functional:
      - "#f43f5e"
      - "#fbbf24"
      - "#22c55e"
todos:
  - id: install-threejs
    content: 安装 three.js 依赖
    status: completed
  - id: create-hero-animation
    content: 创建 HeroAnimation.vue 组件，实现 Three.js 场景初始化和基础粒子系统
    status: completed
    dependencies:
      - install-threejs
  - id: add-code-block
    content: 添加中心代码块元素和键盘粒子形态
    status: completed
    dependencies:
      - create-hero-animation
  - id: add-mouse-interaction
    content: 实现鼠标交互效果（跟随和涟漪）
    status: completed
    dependencies:
      - add-code-block
  - id: modify-hero-section
    content: 修改 HeroSection.vue 为双栏布局，集成动画组件
    status: completed
    dependencies:
      - add-mouse-interaction
---

## 产品概述

在 Hero 区域文本介绍右侧添加一个与暗色主题协调的 Three.js 3D 动画组件，展示代码/技术元素（代码块、终端、键盘）。桌面端支持鼠标跟随交互，移动端/无交互时自动播放动画。

## 核心功能

- **3D 粒子动画**：使用 Three.js 创建代码/技术主题的 3D 粒子效果
- **技术元素展示**：粒子形成代码块、终端、键盘等形态
- **双模式交互**：
- **桌面端**：粒子跟随鼠标移动产生波纹/扩散效果
- **移动端**：自动播放动画（无交互，避免与滑动冲突）
- **无交互时**：自动播放默认动画
- **响应式布局**：双栏布局，移动端也显示动画
- **性能优化**：使用 requestAnimationFrame，支持 reduced-motion

## 技术栈

- **3D 引擎**：Three.js（纯 ES Module，无需额外 loader）
- **框架**：Nuxt 3 + Vue 3 + TypeScript
- **样式**：Tailwind CSS
- **交互**：Vue Composition API + Three.js Raycaster

## 实现方案

### 动画设计

创建一个技术主题的 3D 场景：

- **核心元素**：中心浮动代码块（模拟终端窗口）
- **粒子系统**：环绕代码块的发光粒子，形成键盘按键形状流动
- **自动播放动画**：
- 粒子围绕中心代码块旋转运动
- 代码块微微浮动旋转
- 波浪式粒子流动效果
- **桌面端交互**：鼠标移动时粒子产生涟漪扩散，跟随鼠标位置

### 技术架构

```
HeroSection.vue (双栏布局)
├── 左栏：现有文本内容
└── 右栏：HeroAnimation.vue
    ├── Canvas 渲染器
    ├── 粒子系统（Point + BufferGeometry）
    ├── 中心代码块（Box + ShaderMaterial）
    └── 鼠标交互（Raycaster + 动态更新）
```

### 性能考量

- 粒子数量控制在 500-1000 个
- 使用 BufferGeometry 减少 GPU 内存
- 移动端正常显示动画（自动播放模式）
- 支持 `prefers-reduced-motion` 媒体查询
- 检测设备类型自动切换交互模式

### 目录结构

```
app/
├── components/
│   ├── HeroSection.vue      # [MODIFY] 改为双栏布局，引入动画组件
│   └── HeroAnimation.vue    # [NEW] Three.js 3D 动画组件
└── assets/
    └── css/
        └── main.css         # [MODIFY] 添加动画容器样式
```

## 实现细节

### HeroAnimation.vue 核心结构

- 使用 `<client-only>` 包裹，避免 SSR 问题
- 生命周期：`onMounted` 初始化 Three.js 场景，`onUnmounted` 清理资源
- 响应式：监听容器尺寸变化，自动调整 canvas 大小
- 配色：使用 indigo (#6366f1) 和 teal (#14b8a6) 渐变粒子

### HeroSection.vue 改造

- 外层改为 `flex flex-col md:flex-row` 双栏布局
- 文本内容包裹在 `flex-1` 容器中
- 动画组件在移动端也显示（使用更小尺寸）

### HeroAnimation.vue 交互逻辑

```
onMounted:
  1. 初始化 Three.js 场景
  2. 检测设备类型（isMobile = window.innerWidth < 768）
  3. 启动自动播放动画循环

动画循环:
  - 始终运行自动播放动画（粒子旋转、代码块浮动）
  - 桌面端：监听 mousemove，叠加鼠标跟随效果
  - 移动端：仅运行自动动画

窗口 resize:
  - 重新检测设备类型
  - 调整 canvas 尺寸
```

## 设计风格

动画组件采用科技感十足的暗色主题设计，与现有页面风格完美融合：

- **中心元素**：玻璃态代码块，带有终端窗口风格的顶栏（红黄绿按钮）
- **粒子效果**：indigo 到 teal 渐变的小光点，形成键盘按键形态流动
- **光晕效果**：粒子周围带有微弱的 glow 效果，呼应背景 blob 动画
- **自动动画**：粒子围绕中心旋转，产生动态光流效果
- **桌面端交互**：鼠标移动时产生涟漪，粒子跟随鼠标位置偏移

## 视觉层次

```
背景层（页面 blob 动画）
  ↓
Canvas 层（Three.js 渲染）
  ├── 粒子层（最远）
  ├── 代码块层（中间）
  └── 交互效果层（最近）
```