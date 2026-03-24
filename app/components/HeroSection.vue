<template>
  <section id="about" class="min-h-[85vh] flex flex-col md:flex-row justify-center items-center gap-8 animate-slide-up">
    <!-- Left: Text Content -->
    <div class="flex-1 flex flex-col justify-center items-start">
      <div
        class="mb-4 inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-medium">
        <span class="animate-pulse mr-2 w-2 h-2 rounded-full bg-teal-400" />
        Open to Work
      </div>

      <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        <span class="text-gradient">Hi!</span> 初次见面
      </h1>

      <p class="text-xl md:text-2xl text-slate-400 max-w-3xl mb-8 leading-relaxed">
        我是一个从<span class="text-indigo-400 font-semibold">应用心理学</span>跨界，
        凭借<span class="text-teal-400 font-semibold">自驱力</span>闯入前端领域的开发者。
        <br class="hidden md:block">
        我不仅写代码，更懂得用<span class="text-indigo-400">同理心</span>构建用户体验。
      </p>

      <div class="flex flex-wrap gap-4 mb-12">
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

      <div class="flex space-x-4">
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
      <div class="mt-12 flex items-center space-x-6 text-slate-500 text-sm">
        <span class="flex items-center">
          <Icon name="lucide:map-pin" class="w-4 h-4 mr-1" />
          杭州
        </span>
        <a href="https://github.com/EafenQAQ" target="_blank"
          class="flex items-center hover:text-white transition-colors">
          <Icon name="lucide:github" class="w-4 h-4 mr-1" />
          EafenQAQ
        </a>
        <a href="https://eafen-resume.netlify.app/" target="_blank"
          class="flex items-center hover:text-white transition-colors">
          <Icon name="lucide:globe" class="w-4 h-4 mr-1" />
          Web版简历
        </a>
      </div>
    </div>

    <!-- Right: 3D Animation -->
    <div class="hidden md:flex flex-1 items-center justify-center max-w-md h-[400px]">
      <ClientOnly>
        <HeroAnimation />
      </ClientOnly>
    </div>

    <!-- Mobile: Smaller Animation -->
    <div class="md:hidden w-full h-[250px] mt-4">
      <ClientOnly>
        <HeroAnimation />
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #818cf8, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
