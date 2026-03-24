<template>
  <section  id="about" class="min-h-[85vh] flex flex-col-reverse md:flex-row justify-center items-center gap-8">

    
    <!-- Left: Text Content -->
    <div v-show="runAnimation" class="flex-1 flex flex-col justify-center items-start">
      <div
        v-fade-in="{ delay: 0 }"
        class="mb-4 inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-medium">
        <span class="animate-pulse mr-2 w-2 h-2 rounded-full bg-teal-400" />
        Open to Work
      </div>

      <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight flex items-center gap-2">
        <img v-fade-in="{ delay: 1000 }" class="w-20 rounded-full" :src="myAvatar" alt="myAvatar">
        <div v-fade-in="{ delay: 2000 }"><span  class="text-gradient">Hi!</span> 初次见面</div>
      </h1>

      <p v-fade-in="{ delay: 3000 }" class="text-xl md:text-2xl text-slate-400 max-w-3xl mb-8 leading-relaxed">
        我是一个从<span class="text-indigo-400 font-semibold">应用心理学</span>跨界，
        凭借<span class="text-teal-400 font-semibold">自驱力</span>闯入前端领域的开发者。
        <br class="hidden md:block">
        我不仅写代码，更懂得用<span class="text-indigo-400">同理心</span>构建用户体验。
      </p>

      <div v-fade-in="{ delay: 4000 }" class="flex flex-wrap gap-4 mb-12">
        <div class="glass-card px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-white/5 transition-all">
          <Icon name="lucide:book-open" class="text-teal-400 w-5 h-5" />
          <span class="font-mono">20+ 技术文档研读</span>
        </div>
        <div class="glass-card px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-white/5 transition-all">
          <Icon name="lucide:github" class="text-indigo-400 w-5 h-5" />
          <span class="font-mono">23 GitHub Repos</span>
        </div>
        <div class="glass-card px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-white/5 transition-all">
          <Icon name="lucide:layers" class="text-pink-400 w-5 h-5" />
          <span class="font-mono">独立全栈能力</span>
        </div>
      </div>

      <div v-fade-in="{ delay: 5000 }" class="flex space-x-4">
        <a href="#projects"
          class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
          查看项目
        </a>
        <a
          href="#contact"
          class="px-8 py-3 border border-slate-600 rounded-lg font-bold hover:bg-white/5 transition-all flex items-center"
        >
          <Icon name="lucide:mail" class="w-4 h-4 mr-2" />
          联系我
        </a>
      </div>

      <!-- Quick Contact Info -->
      <div v-fade-in="{ delay: 5000 }" class="mt-12 flex items-center space-x-6 text-slate-500 text-sm">
        <span class="flex items-center">
          <Icon name="lucide:map-pin" class="w-4 h-4 mr-1" />
          杭州
        </span>
        <a href="https://github.com/EafenQAQ" target="_blank"
          class="flex items-center hover:text-white transition-colors">
          <Icon name="lucide:github" class="w-4 h-4 mr-1" />
          EafenQAQ
        </a>
        <a href="/resume.pdf" download="Eafen_resume.pdf" target="_blank"
          class="flex items-center hover:text-white transition-colors">
          <Icon name="lucide:globe" class="w-4 h-4 mr-1" />
          个人简历
        </a>
      </div>
    </div>

    <!-- Right: 3D Animation -->
    <div class="hidden md:flex flex-1 items-center justify-center max-w-lg h-[500px] overflow-visible">
      <ClientOnly>
        <HeroAnimation />
      </ClientOnly>
    </div>

    <!-- Mobile: 3D Animation at top -->
    <div class="md:hidden w-full h-[300px] mb-4 overflow-visible order-1">
      <ClientOnly>
        <HeroAnimation />
      </ClientOnly>
    </div>
  </section>
</template>
<script setup>
import myAvatar from '~/assets/img/myAvatar.webp'

let runAnimation = ref(false)
onMounted(() => {
  runAnimation.value = true
})




</script>
<style scoped>
.text-gradient {
  background: linear-gradient(to right, #818cf8, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>


