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

// Three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let nodeGroup: THREE.Group
let lineSegments: THREE.LineSegments
let animationId: number
let isMobile = false

// Mouse position for desktop interaction
const mouse = new THREE.Vector2(0, 0)
const targetMouse = new THREE.Vector2(0, 0)

// Constellation configuration
const NODE_COUNT = 120
const CONNECTION_DISTANCE = 2.2
const SPHERE_RADIUS = 3
const COLORS = {
  indigo: new THREE.Color(0x6366f1),
  teal: new THREE.Color(0x14b8a6),
  pink: new THREE.Color(0xf43f5e)
}

onMounted(() => {
  if (!containerRef.value || !canvasRef.value) return

  isMobile = window.innerWidth < 768
  initScene()
  createConstellation()
  setupEventListeners()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  if (!isMobile) {
    window.removeEventListener('mousemove', handleMouseMove)
  }

  // Dispose Three.js resources
  if (renderer) {
    renderer.dispose()
  }
  if (nodeGroup) {
    nodeGroup.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        ;(child.material as THREE.Material).dispose()
      }
    })
  }
  if (lineSegments) {
    lineSegments.geometry.dispose()
    ;(lineSegments.material as THREE.Material).dispose()
  }
})

function initScene() {
  const container = containerRef.value!
  const width = container.clientWidth
  const height = container.clientHeight

  // Scene
  scene = new THREE.Scene()

  // Camera with wider FOV for more depth perception
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
  camera.position.z = 8

  // Renderer with transparent background
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!,
    alpha: true,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // Important: clear color is transparent
  renderer.setClearColor(0x000000, 0)
}

function createConstellation() {
  const nodePositions: THREE.Vector3[] = []

  // Create group to hold all nodes
  nodeGroup = new THREE.Group()

  // Generate nodes in spherical distribution
  for (let i = 0; i < NODE_COUNT; i++) {
    const node = createNode(i)
    nodePositions.push(node.position)
    nodeGroup.add(node)
  }

  scene.add(nodeGroup)

  // Create lines connecting nearby nodes
  createLines(nodePositions)
}

function createNode(index: number): THREE.Mesh {
  // Random position on sphere surface with some thickness
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  
  // Add randomness to radius for depth variation
  const radius = SPHERE_RADIUS + (Math.random() - 0.5) * 1.5
  
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.sin(phi) * Math.sin(theta)
  const z = radius * Math.cos(phi)

  // Color gradient based on position
  const normalizedY = (y + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)
  const color = new THREE.Color().lerpColors(COLORS.indigo, COLORS.teal, normalizedY)

  // Create glowing sphere for node
  const geometry = new THREE.SphereGeometry(0.08 + Math.random() * 0.05, 16, 16)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uTime: { value: 0 },
      uIndex: { value: index }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uIndex;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Glow effect based on normal direction
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        
        // Pulsing effect with offset per node
        float pulse = sin(uTime * 2.0 + uIndex * 0.5) * 0.2 + 0.8;
        
        // Bright core
        vec3 finalColor = uColor * (intensity * 2.0 + 0.5) * pulse;
        
        // Add subtle white center
        finalColor += vec3(0.3, 0.35, 0.45) * (1.0 - intensity) * 0.5;
        
        gl_FragColor = vec4(finalColor, 0.9);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const node = new THREE.Mesh(geometry, material)
  node.position.set(x, y, z)

  // Store original position for animation
  node.userData.originalPos = new THREE.Vector3(x, y, z)
  node.userData.randomOffset = Math.random() * Math.PI * 2

  return node
}

function createLines(positions: THREE.Vector3[]) {
  const linePositions: number[] = []
  const lineColors: number[] = []

  // Connect nearby nodes
  for (let i = 0; i < positions.length; i++) {
    const posI = positions[i]
    if (!posI) continue
    
    for (let j = i + 1; j < positions.length; j++) {
      const posJ = positions[j]
      if (!posJ) continue
      
      const distance = posI.distanceTo(posJ)

      if (distance < CONNECTION_DISTANCE) {
        // Add line segment
        linePositions.push(
          posI.x, posI.y, posI.z,
          posJ.x, posJ.y, posJ.z
        )

        // Calculate opacity based on distance
        const opacity = 1.0 - (distance / CONNECTION_DISTANCE)
        
        // Use average color with opacity
        const avgColor = new THREE.Color().lerpColors(
          COLORS.indigo,
          COLORS.teal,
          (posI.y + posJ.y + SPHERE_RADIUS * 2) / (SPHERE_RADIUS * 4)
        )

        lineColors.push(
          avgColor.r, avgColor.g, avgColor.b, opacity,
          avgColor.r, avgColor.g, avgColor.b, opacity
        )
      }
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      attribute vec4 color;
      varying vec4 vColor;
      
      void main() {
        vColor = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec4 vColor;
      uniform float uTime;
      
      void main() {
        // Add subtle pulsing to lines
        float pulse = sin(uTime * 1.5) * 0.1 + 0.9;
        
        // Fade line with distance effect
        float alpha = vColor.a * pulse;
        
        // Make lines glow slightly
        vec3 glow = vColor.rgb * (1.0 + 0.3 * pulse);
        
        gl_FragColor = vec4(glow, alpha * 0.6);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  lineSegments = new THREE.LineSegments(geometry, material)
  scene.add(lineSegments)
}

function setupEventListeners() {
  window.addEventListener('resize', handleResize)

  if (!isMobile) {
    window.addEventListener('mousemove', handleMouseMove)
  }
}

function handleResize() {
  if (!containerRef.value || !renderer || !camera) return

  isMobile = window.innerWidth < 768
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function handleMouseMove(event: MouseEvent) {
  // Normalize mouse position to -1 to 1
  targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
  targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const time = performance.now() * 0.001

  // Smooth mouse following
  mouse.x += (targetMouse.x - mouse.x) * 0.05
  mouse.y += (targetMouse.y - mouse.y) * 0.05

  // Rotate entire constellation slowly
  if (nodeGroup) {
    nodeGroup.rotation.y = time * 0.1
    nodeGroup.rotation.x = Math.sin(time * 0.05) * 0.1

    // Add mouse influence on desktop
    if (!isMobile) {
      nodeGroup.rotation.y += mouse.x * 0.2
      nodeGroup.rotation.x += mouse.y * 0.1
    }
  }

  // Rotate lines to match nodes
  if (lineSegments) {
    lineSegments.rotation.y = time * 0.1
    lineSegments.rotation.x = Math.sin(time * 0.05) * 0.1

    if (!isMobile) {
      lineSegments.rotation.y += mouse.x * 0.2
      lineSegments.rotation.x += mouse.y * 0.1
    }

    // Update line shader
    if (lineSegments.material instanceof THREE.ShaderMaterial && lineSegments.material.uniforms.uTime) {
      lineSegments.material.uniforms.uTime.value = time
    }
  }

  // Animate individual nodes
  if (nodeGroup) {
    nodeGroup.children.forEach((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial && child.material.uniforms.uTime) {
        child.material.uniforms.uTime.value = time

        // Add subtle floating motion
        const original = child.userData.originalPos
        const offset = child.userData.randomOffset
        
        child.position.x = original.x + Math.sin(time * 0.5 + offset) * 0.05
        child.position.y = original.y + Math.cos(time * 0.4 + offset) * 0.05
        child.position.z = original.z + Math.sin(time * 0.3 + offset) * 0.05
      }
    })
  }

  renderer.render(scene, camera)
}
</script>

<style scoped>
canvas {
  display: block;
}
</style>
