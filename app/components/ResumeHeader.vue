<template>
  <section id="about" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4">
    <div class="max-w-4xl w-full">
      <UCard class="shadow-xl">
        <div class="flex flex-col md:flex-row items-center gap-8 p-8">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              src="/img/zhaopian.jpg"
              alt="高一帆"
              class="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              高一帆
            </h1>

            <p class="text-lg text-gray-700 mb-6 leading-relaxed">
              1个从应⽤⼼理学专业跨界⾃学进⼊前端开发领域的求职者。自学期间阅读了
              <span class="font-semibold text-blue-600">20+</span> 技术文档，创建了
              <span class="font-semibold text-blue-600">23</span> 个github库，具备独立从零构建全栈Demo应用的能力。
            </p>

            <!-- Contact Information -->
            <div class="space-y-3 text-gray-600">
              <div class="flex items-center justify-center md:justify-start gap-2">
                <Icon name="mdi:phone" class="text-blue-500" size="20" />
                <span>158 4700 7426</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2">
                <Icon name="mdi:wechat" class="text-green-500" size="20" />
                <span>e15847007426</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2">
                <Icon name="mdi:email" class="text-blue-600" size="20" />
                <span>15847007426@163.com</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2">
                <Icon name="mdi:web" class="text-purple-500" size="20" />
                <a
                  href="https://eafen-resume.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  eafen-resume.netlify.app
                </a>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2">
                <Icon name="mdi:school" class="text-orange-500" size="20" />
                <span>本科 | 济南大学 | 应用心理学</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2">
                <Icon name="mdi:map-marker" class="text-red-500" size="20" />
                <span>现居：杭州</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props needed - content is static based on resume.md
</script>
