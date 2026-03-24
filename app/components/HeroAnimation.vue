<template>
  <div ref="containerRef" class="w-full h-full min-h-[250px] relative">
    <canvas ref="canvasRef" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

// Three.js 对象
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let nodeGroup: THREE.Group
let lineSegments: THREE.LineSegments
let animationId: number
let isMobile = false

// 交互状态控制
let isDragging = false
let lastMouseX = 0
let lastMouseY = 0
let rotationVelocityX = 0
let rotationVelocityY = 0
let autoRotate = true
let isInertiaActive = false

// 自动旋转的时间/角度基准
let autoRotateStartTime: number = 0
let autoRotateStartRotationY: number = 0

// 配置
const ICOSAHEDRON_RADIUS = 3.5
const ICOSAHEDRON_DETAIL = 1
const COLORS = {
  indigo: new THREE.Color(0x6366f1),
  teal: new THREE.Color(0x14b8a6)
}

onMounted(() => {
  if (!containerRef.value || !canvasRef.value) return

  isMobile = window.innerWidth < 768
  
  initScene()
  createConstellation()
  setupEventListeners()
  
  // 初始化自动旋转起点
  const time = performance.now() * 0.001
  autoRotateStartTime = time
  autoRotateStartRotationY = 0
  
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  if (!isMobile) {
    canvasRef.value?.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  if (renderer) renderer.dispose()
})

function initScene() {
  const container = containerRef.value!
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.z = 8

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!,
    alpha: true,
    antialias: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function createConstellation() {
  const icosahedron = new THREE.IcosahedronGeometry(ICOSAHEDRON_RADIUS, ICOSAHEDRON_DETAIL)
  const vertices = icosahedron.attributes.position
  nodeGroup = new THREE.Group()

  for (let i = 0; i < vertices.count; i++) {
    const node = createNode(i, new THREE.Vector3(vertices.getX(i), vertices.getY(i), vertices.getZ(i)))
    nodeGroup.add(node)
  }
  scene.add(nodeGroup)
  createIcosahedronLines(icosahedron)
}

function createNode(index: number, position: THREE.Vector3): THREE.Mesh {
  const normalizedY = (position.y + ICOSAHEDRON_RADIUS) / (ICOSAHEDRON_RADIUS * 2)
  const color = new THREE.Color().lerpColors(COLORS.indigo, COLORS.teal, normalizedY)
  const geometry = new THREE.SphereGeometry(0.08, 32, 32)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uTime: { value: 0 },
      uIndex: { value: index }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uIndex;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float pulse = sin(uTime * 2.0 + uIndex * 0.5) * 0.2 + 0.8;
        gl_FragColor = vec4(uColor * (intensity * 2.0 + 0.5) * pulse, 0.9);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const node = new THREE.Mesh(geometry, material)
  node.position.copy(position)
  return node
}

function createIcosahedronLines(icosahedron: THREE.IcosahedronGeometry) {
  const wireframe = new THREE.WireframeGeometry(icosahedron)
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: COLORS.indigo } },
    vertexShader: `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 0.2); }`,
    transparent: true
  })
  lineSegments = new THREE.LineSegments(wireframe, material)
  scene.add(lineSegments)
}

// --- 事件处理逻辑 ---

function setupEventListeners() {
  window.addEventListener('resize', handleResize)
  if (!isMobile && canvasRef.value) {
    canvasRef.value.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }
}

function handleResize() {
  if (!containerRef.value) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function handleMouseDown(e: MouseEvent) {
  isDragging = true
  autoRotate = false
  isInertiaActive = false
  lastMouseX = e.clientX
  lastMouseY = e.clientY
  rotationVelocityX = 0
  rotationVelocityY = 0
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging || !nodeGroup) return

  const deltaX = e.clientX - lastMouseX
  const deltaY = e.clientY - lastMouseY

  // 灵敏度系数
  const sensitivity = 0.005
  nodeGroup.rotation.y += deltaX * sensitivity
  nodeGroup.rotation.x += deltaY * sensitivity
  
  if (lineSegments) {
    lineSegments.rotation.y = nodeGroup.rotation.y
    lineSegments.rotation.x = nodeGroup.rotation.x
  }

  // 计算即时速度
  rotationVelocityY = deltaX * sensitivity
  rotationVelocityX = deltaY * sensitivity

  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

function handleMouseUp() {
  if (!isDragging) return
  isDragging = false
  // 开启惯性模式
  isInertiaActive = true
}

// --- 核心动画循环 ---

function animate() {
  animationId = requestAnimationFrame(animate)
  const time = performance.now() * 0.001

  if (nodeGroup) {
    if (isDragging) {
      // 拖拽中逻辑在 handleMouseMove 处理
    } else if (isInertiaActive) {
      // 1. 惯性逻辑
      nodeGroup.rotation.y += rotationVelocityY
      nodeGroup.rotation.x += rotationVelocityX
      if (lineSegments) {
        lineSegments.rotation.y = nodeGroup.rotation.y
        lineSegments.rotation.x = nodeGroup.rotation.x
      }

      // 2. 衰减惯性 (摩擦力)
      rotationVelocityY *= 0.95
      rotationVelocityX *= 0.95

      // 3. 惯性停止判定
      if (Math.abs(rotationVelocityY) < 0.001 && Math.abs(rotationVelocityX) < 0.001) {
        isInertiaActive = false
        autoRotate = true
        
        // 【关键修复点】：在停止的瞬间，记录下当前的角度和时间
        // 这样 autoRotate 逻辑就会从这里“接棒”，不会发生跳变
        autoRotateStartTime = time
        autoRotateStartRotationY = nodeGroup.rotation.y
      }
    } else if (autoRotate) {
      // 4. 自动旋转逻辑
      const elapsed = time - autoRotateStartTime
      // 基于停止时的角度继续累加旋转值
      nodeGroup.rotation.y = autoRotateStartRotationY + elapsed * 0.2
      // 保持 X 轴回归到平稳状态或轻微晃动
      nodeGroup.rotation.x *= 0.98 
      
      if (lineSegments) {
        lineSegments.rotation.y = nodeGroup.rotation.y
        lineSegments.rotation.x = nodeGroup.rotation.x
      }
    }

    // 更新 Shader 时间参数
    nodeGroup.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.material.uniforms) {
        child.material.uniforms.uTime.value = time
      }
    })
  }

  renderer.render(scene, camera)
}
</script>