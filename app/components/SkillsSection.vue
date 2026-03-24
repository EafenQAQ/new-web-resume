<template>
  <section id="skills" class="py-20">
    <div v-fade-in="{ delay: 0 }" class="flex items-center mb-12">
      <div class="h-px bg-slate-700 flex-grow" />
      <h2 class="text-3xl font-bold ml-4">技术栈</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(category, index) in skills"
        :key="index"
        v-fade-in="{ delay: 100 + index * 100 }"
        class="glass-card rounded-xl p-6"
      >
        <h3 class="text-lg font-bold mb-4 text-indigo-400 flex items-center">
          <Icon :name="`lucide:${category.icon}`" class="w-5 h-5 mr-2" />
          {{ category.title }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="item in category.items"
            :key="item"
            class="px-3 py-1.5 text-sm bg-slate-800/50 hover:bg-slate-700 rounded transition-colors cursor-default border border-transparent hover:border-slate-600"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- AI Coding Special Section -->
    <div v-fade-in="{ delay: 500 }" class="mt-8 glass-card rounded-xl p-8 border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-900/10 to-transparent">
      <div class="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-teal-400 mb-2 flex items-center">
            <Icon name="lucide:sparkles" class="w-5 h-5 mr-2" />
            AI 赋能开发 (AI-Native)
          </h3>
          <p class="text-slate-300 text-sm max-w-2xl">
            熟练运用
            <strong>Spec-Driven</strong>
            开发模式，利用文档先行与需求确认减少 AI
            幻觉，将生成代码采纳率提升至 <strong>90%+</strong>。擅长使用
            Claude Code, Cursor, Make.com 构建自动化工作流。
          </p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-2">
          <div class="px-4 py-2 bg-slate-900 rounded-lg text-xs font-mono text-slate-400 border border-slate-700">
            Python Scripting
          </div>
          <div class="px-4 py-2 bg-slate-900 rounded-lg text-xs font-mono text-slate-400 border border-slate-700">
            Prompt Engineering
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { skills } from '~/constants/resume'
</script>
