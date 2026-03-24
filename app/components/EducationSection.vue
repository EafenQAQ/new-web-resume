<template>
  <section id="education" class="py-20 flex flex-col md:flex-row gap-12">
    <div v-fade-in="{ delay: 0 }" class="md:w-1/2">
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <Icon name="lucide:graduation-cap" class="mr-3 text-indigo-400 w-6 h-6" />
        教育经历
      </h2>
      <div class="glass-card p-6 rounded-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <Icon name="lucide:book" class="w-24 h-24" />
        </div>
        <h3 class="text-xl font-bold">济南大学</h3>
        <p class="text-teal-400 mb-2">教育学学士 | 应用心理学专业</p>
        <p class="text-slate-500 text-sm mb-4">2019.09 - 2023.06</p>
        <p class="text-slate-300 text-sm">
          <span class="block mb-1">Pass CET6.</span>
          心理学背景赋予我在项目开发中独特的视角：更关注用户交互逻辑、情感化设计以及产品的易用性。
        </p>
      </div>
    </div>

    <div v-fade-in="{ delay: 150 }" class="md:w-1/2">
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <Icon name="lucide:user" class="mr-3 text-indigo-400 w-6 h-6" />
        自我评价
      </h2>
      <div class="space-y-4">
        <div class="glass-card p-5 rounded-xl border-l-4 border-l-purple-500">
          <h4 class="font-bold mb-1">持续学习者</h4>
          <p class="text-sm text-slate-400">
            从零自学全栈开发，阅读20+技术文档，创建23个仓库。对技术迭代保持高度敏感。
          </p>
        </div>
        <div class="glass-card p-5 rounded-xl border-l-4 border-l-pink-500">
          <h4 class="font-bold mb-1">同理心驱动</h4>
          <p class="text-sm text-slate-400">
            利用心理学背景理解用户痛点，不仅仅是完成功能，更是解决问题。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
