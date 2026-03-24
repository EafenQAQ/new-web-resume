<template>
  <section id="projects" class="py-20">
    <div v-fade-in="{ delay: 0 }" class="flex items-center mb-12">
      <h2 class="text-3xl font-bold mr-4">精选项目</h2>
      <div class="h-px bg-slate-700 flex-grow" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div
        v-for="(project, index) in projects"
        :key="index"
        v-fade-in="{ delay: 100 + index * 100 }"
        class="glass-card rounded-2xl overflow-hidden transition-all duration-300 group hover:-translate-y-2 flex flex-col"
      >
        <!-- Preview Image - Desktop Only -->
        <div
          v-if="project.preview"
          class="hidden lg:block relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-blue-900/20 z-10" />
          <img
            :src="project.preview"
            :alt="project.title"
            class="w-full h-full object-cover min-h-[300px]"
          />
        </div>

        <!-- Content -->
        <div class="flex-grow p-6 md:p-8 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Icon :name="`lucide:${project.icon}`" class="w-6 h-6" />
            </div>
            <div class="flex space-x-3">
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                class="text-slate-400 hover:text-white"
                title="View Code"
              >
                <Icon name="lucide:github" class="w-5 h-5" />
              </a>
              <a
                v-if="project.demo"
                :href="project.demo"
                target="_blank"
                class="text-slate-400 hover:text-teal-400"
                title="Live Demo"
              >
                <Icon name="lucide:external-link" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <h3 class="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
            {{ project.title }}
          </h3>
          <p class="text-sm text-teal-400 mb-4 font-mono">
            {{ project.subtitle }}
          </p>

          <p class="text-slate-400 mb-6 flex-grow leading-relaxed text-sm">
            {{ project.description }}
          </p>

          <!-- Highlights -->
          <div class="mb-6 space-y-2">
            <div
              v-for="(highlight, hIndex) in project.highlights"
              :key="hIndex"
              class="flex items-start text-sm text-slate-300"
            >
              <Icon name="lucide:check-circle" class="w-4 h-4 mr-2 text-teal-500 mt-0.5 flex-shrink-0" />
              <span>{{ highlight }}</span>
            </div>
          </div>

          <!-- Tech Stack Tags -->
          <div class="flex flex-wrap gap-2 mt-auto">
            <span
              v-for="tech in project.stack"
              :key="tech"
              class="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-300"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { projects as projectData } from '~/constants/resume'

// Import preview images
import soundFlowImg from '~/assets/img/soundFlow-Homepage.webp'
import mindFreeImg from '~/assets/img/mindFree-Chatroom.webp'
import catPawBlogImg from '~/assets/img/catPawBlog-psych.webp'
import caffMasterImg from '~/assets/img/caffMaster-shop.webp'

// Map project titles to their preview images
const previewMap: Record<string, string> = {
  'Sound-Flow 音乐平台': soundFlowImg,
  'MindFree AI 心理咨询': mindFreeImg,
  'Cat-Paw-Blog': catPawBlogImg,
  'Caff Master 仿影视飓风主页': caffMasterImg,
}

// Combine project data with preview images
const projects = projectData.map(p => ({
  ...p,
  preview: previewMap[p.title],
}))
</script>
