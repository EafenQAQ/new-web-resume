<template>
  <section id="contact" class="py-20">
    <div v-fade-in="{ delay: 0 }" class="flex items-center mb-12">
      <div class="h-px bg-slate-700 flex-grow" />
      <h2 class="text-3xl font-bold ml-4">联系方式</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Email Card -->
      <a
        v-fade-in="{ delay: 100 }"
        href="mailto:15847007426@163.com"
        class="glass-card rounded-xl p-6 flex items-center space-x-4 hover:bg-white/5 transition-all group"
      >
        <div class="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon name="lucide:mail" class="text-indigo-400 w-6 h-6" />
        </div>
        <div class="flex-grow">
          <h3 class="text-sm text-slate-400 mb-1">电子邮箱</h3>
          <p class="text-lg font-mono text-slate-200">15847007426@163.com</p>
        </div>
        <Icon name="lucide:arrow-up-right" class="text-slate-500 w-5 h-5 group-hover:text-indigo-400 transition-colors" />
      </a>

      <!-- Phone Card -->
      <a
        v-fade-in="{ delay: 200 }"
        href="tel:15847007426"
        class="glass-card rounded-xl p-6 flex items-center space-x-4 hover:bg-white/5 transition-all group"
      >
        <div class="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon name="lucide:phone" class="text-teal-400 w-6 h-6" />
        </div>
        <div class="flex-grow">
          <h3 class="text-sm text-slate-400 mb-1">电话</h3>
          <p class="text-lg font-mono text-slate-200">158 4700 7426</p>
        </div>
        <Icon name="lucide:arrow-up-right" class="text-slate-500 w-5 h-5 group-hover:text-teal-400 transition-colors" />
      </a>

      <!-- WeChat Card -->
      <div
        v-fade-in="{ delay: 300 }"
        class="glass-card rounded-xl p-6 flex items-center space-x-4"
      >
        <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Icon name="lucide:message-circle" class="text-green-400 w-6 h-6" />
        </div>
        <div class="flex-grow">
          <h3 class="text-sm text-slate-400 mb-1">微信</h3>
          <p class="text-lg font-mono text-slate-200">e15847007426</p>
        </div>
      </div>

      <!-- Location Card -->
      <div
        v-fade-in="{ delay: 400 }"
        class="glass-card rounded-xl p-6 flex items-center space-x-4"
      >
        <div class="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
          <Icon name="lucide:map-pin" class="text-pink-400 w-6 h-6" />
        </div>
        <div class="flex-grow">
          <h3 class="text-sm text-slate-400 mb-1">现居</h3>
          <p class="text-lg font-mono text-slate-200">杭州</p>
        </div>
      </div>
    </div>

    <!-- Social Links -->
    <div v-fade-in="{ delay: 500 }" class="mt-8 glass-card rounded-xl p-6">
      <h3 class="text-sm text-slate-400 mb-4 text-center">更多链接</h3>
      <div class="flex flex-wrap justify-center gap-4">
        <a
          href="https://github.com/EafenQAQ"
          target="_blank"
          class="px-6 py-3 bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-all flex items-center space-x-2 border border-slate-700 hover:border-slate-600"
        >
          <Icon name="lucide:github" class="w-5 h-5" />
          <span>GitHub</span>
        </a>
        <a
          href="https://eafen-resume.netlify.app/"
          target="_blank"
          class="px-6 py-3 bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-all flex items-center space-x-2 border border-slate-700 hover:border-slate-600"
        >
          <Icon name="lucide:globe" class="w-5 h-5" />
          <span>网页版简历</span>
        </a>
      </div>
    </div>
  </section>
</template>
