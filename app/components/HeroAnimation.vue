<template>
  <div ref="containerRef" class="w-full h-full min-h-[400px] relative">
    <canvas ref="canvasRef" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let constellationGroup: THREE.Group
let animationId: number

// 交互与动画状态
let isDragging = false
let lastMouseX = 0
let lastMouseY = 0
let rotationVelocityX = 0
let rotationVelocityY = 0
let autoRotate = true
let isInertiaActive = false

// 【修复逻辑的关键变量】
// 我们不再记录 StartTime，而是记录“最后一次更新的时间戳”，用来计算增量（Delta Time）
let lastFrameTime = 0

// 处女座精细结构坐标
const VIRGO_STARS = [
  { x: -0.5, y: 3.2, z: -0.5, size: 0.04 },
  { x: 0, y: 2.5, z: 0.2, size: 0.06 },
  { x: -1.2, y: 1.5, z: -0.8, size: 0.05 },
  { x: -0.8, y: 1.2, z: 0.4, size: 0.06 },
  { x: 0.2, y: 0.5, z: -0.5, size: 0.08 },
  { x: 1.8, y: 1.0, z: 0.8, size: 0.07 },
  { x: 0.8, y: 0, z: -1.2, size: 0.04 }, 
  { x: 0.5, y: -0.8, z: 0.3, size: 0.12 }, // Spica
  { x: -1.5, y: -1.2, z: 1.0, size: 0.05 },
  { x: -1.0, y: -1.8, z: -0.4, size: 0.06 },
  { x: 0.8, y: -2.5, z: 0.2, size: 0.07 },
  { x: 2.2, y: -1.2, z: -0.6, size: 0.05 },
  { x: 2.8, y: -2.2, z: 0.5, size: 0.06 },
  { x: 1.5, y: -3.0, z: -0.2, size: 0.04 }
]

const CONSTELLATION_LINES = [
  [1, 2], [1, 3], [3, 4], [4, 5], [4, 7], [7, 8], [7, 9], [7, 10], [5, 11], [11, 12], [12, 13]
]

onMounted(() => {
  if (!containerRef.value || !canvasRef.value) return
  initScene()
  createComplexNebula()
  setupEventListeners()
  lastFrameTime = performance.now() * 0.001
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  if (renderer) renderer.dispose()
})

function initScene() {
  scene = new THREE.Scene()
  const container = containerRef.value!
  camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.z = 10

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!,
    alpha: true,
    antialias: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
}

function createComplexNebula() {
  constellationGroup = new THREE.Group()
  
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
  const glowTexture = createGlowTexture()

  VIRGO_STARS.forEach((star) => {
    const geo = new THREE.SphereGeometry(star.size, 16, 16)
    const mesh = new THREE.Mesh(geo, starMaterial)
    mesh.position.set(star.x, star.y, star.z)
    
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x818cf8,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(star.size * 10, star.size * 10, 1)
    mesh.add(sprite)
    constellationGroup.add(mesh)
  })

  const lineMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.2 })
  const linePoints: THREE.Vector3[] = []
  CONSTELLATION_LINES.forEach(([s, e]) => {
    linePoints.push(new THREE.Vector3(VIRGO_STARS[s].x, VIRGO_STARS[s].y, VIRGO_STARS[s].z))
    linePoints.push(new THREE.Vector3(VIRGO_STARS[e].x, VIRGO_STARS[e].y, VIRGO_STARS[e].z))
  })
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)
  constellationGroup.add(new THREE.LineSegments(lineGeo, lineMat))

  // 三层星云
  createParticleLayer(1500, 40, 0x4f46e5, 0.015, 0.3)
  createParticleLayer(600, 15, 0x2dd4bf, 0.025, 0.5)
  createParticleLayer(150, 8, 0xffffff, 0.04, 0.7)

  scene.add(constellationGroup)
}

function createParticleLayer(count: number, range: number, color: number, size: number, opacity: number) {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = range * (0.3 + Math.random() * 0.7)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    size, color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, sizeAttenuation: true
  })
  constellationGroup.add(new THREE.Points(geo, mat))
}

function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64; canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.3, 'rgba(129, 140, 248, 0.6)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

// --- 交互逻辑 ---

function setupEventListeners() {
  window.addEventListener('resize', handleResize)
  const canvas = canvasRef.value!
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true; autoRotate = false; isInertiaActive = false
    lastMouseX = e.clientX; lastMouseY = e.clientY
    rotationVelocityX = 0; rotationVelocityY = 0
  })
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY
    // 实时更新增量
    rotationVelocityY = deltaX * 0.003
    rotationVelocityX = deltaY * 0.003
    // 直接操作旋转
    constellationGroup.rotation.y += rotationVelocityY
    constellationGroup.rotation.x += rotationVelocityX
    lastMouseX = e.clientX; lastMouseY = e.clientY
  })
  window.addEventListener('mouseup', () => { 
    if (isDragging) { isDragging = false; isInertiaActive = true } 
  })
}

function handleResize() {
  if (!containerRef.value) return
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

// --- 核心动画循环 (彻底解决割裂感) ---

function animate() {
  animationId = requestAnimationFrame(animate)
  const currentTime = performance.now() * 0.001
  const deltaTime = currentTime - lastFrameTime // 计算两帧之间的时间差
  lastFrameTime = currentTime

  if (constellationGroup) {
    if (isDragging) {
      // 拖拽中，旋转由 mousemove 驱动，此处保持静止或做极微小处理
    } else if (isInertiaActive) {
      // 1. 惯性模式：直接在现有 rotation 上叠加速度
      constellationGroup.rotation.y += rotationVelocityY
      constellationGroup.rotation.x += rotationVelocityX
      
      // 摩擦力衰减
      rotationVelocityY *= 0.95
      rotationVelocityX *= 0.95

      // 停止判断
      if (Math.abs(rotationVelocityY) < 0.0001 && Math.abs(rotationVelocityX) < 0.0001) {
        isInertiaActive = false
        autoRotate = true
      }
    } else if (autoRotate) {
      // 2. 自动播放模式：【关键修改】
      // 使用增量式旋转：每一帧只旋转“一小步”，而不是基于绝对时间计算“这一秒应该在哪”
      // 这种方式天然地衔接了任何之前的旋转状态，因为它是从当前位置开始累加的
      const rotationSpeed = 0.15 
      constellationGroup.rotation.y += rotationSpeed * deltaTime
      
      // 让 X 轴缓慢回归到中心平稳状态，增加优雅感
      constellationGroup.rotation.x *= 0.98 
    }

    // 恒星呼吸效果（基于绝对时间，不影响旋转）
    constellationGroup.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const sprite = child.children[0] as THREE.Sprite
        if (sprite) {
          sprite.material.opacity = 0.4 + Math.sin(currentTime * 2 + i) * 0.3
        }
      }
    })
  }
  renderer.render(scene, camera)
}
</script>