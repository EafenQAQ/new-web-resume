<template>
  <div class="relative min-h-screen selection:bg-indigo-500 selection:text-white">
    <!-- Animated Background Blobs -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>

    <!-- Navigation -->
    <TheNavbar />

    <!-- Main Content -->
    <main class="relative z-10 pt-24 pb-12 px-6 container mx-auto max-w-6xl">
      <HeroSection />
      <ProjectsSection />
      <AIJobMatcher />
      <SkillsSection />
      <EducationSection />
      <ContactSection />

      <!-- Footer -->
      <footer class="pt-12 pb-8 text-center text-slate-600 text-sm border-t border-slate-800">
        <p class="mb-2">Designed & Built by Gao Yifan</p>
        <p>Powered by Vue 3, Tailwind & Gemini API</p>
      </footer>
    </main>

    <!-- Chat Bot -->
    <AIChatBot ref="chatBotRef" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '高一帆 | 前端开发工程师',
  meta: [
    { name: 'description', content: '前端开发工程师简历 - 高一帆' }
  ]
})

const chatBotRef = ref<{ chatOpen: ReturnType<typeof ref> } | null>(null)
let hasTriggeredAtBottom = false

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  // 距离底部 100px 时触发
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100

  if (isAtBottom && !hasTriggeredAtBottom && chatBotRef.value) {
    hasTriggeredAtBottom = true
    chatBotRef.value.chatOpen = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
