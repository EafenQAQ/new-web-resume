<template>
  <section id="ai-match" class="py-20">
    <div class="glass-card rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden">
      <div class="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div class="relative z-10">
        <div class="flex items-center mb-6">
          <div
            class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mr-4 shadow-lg shadow-indigo-500/20">
            <Icon name="lucide:sparkles" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold">AI 职位匹配度分析</h2>
            <p class="text-slate-400 text-sm">Powered by Gemini Pro</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/2 space-y-4">
            <p class="text-slate-300">
              粘贴您的 JD (职位描述)，AI 将根据我的简历自动分析匹配度并生成推荐语。
            </p>
            <textarea v-model="jobDescription" placeholder="请在此粘贴职位描述 (Job Description)..."
              class="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all" />
            <button @click="handleAnalyze" :disabled="isAnalyzing || !jobDescription"
              class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-bold transition-all flex justify-center items-center">
              <Icon v-if="isAnalyzing" name="lucide:loader-2" class="animate-spin mr-2 w-5 h-5" />
              {{ isAnalyzing ? '正在分析中...' : '开始分析匹配度' }}
            </button>
          </div>

          <div class="md:w-1/2 bg-slate-900/50 rounded-xl p-6 border border-slate-700 min-h-[300px] flex flex-col">
            <div v-if="!analysisResult && !isAnalyzing && !errorMessage"
              class="flex-grow flex flex-col justify-center items-center text-slate-500">
              <Icon name="lucide:bar-chart-3" class="w-12 h-12 mb-3 opacity-50" />
              <p>等待输入职位描述...</p>
            </div>

            <div v-if="isAnalyzing" class="flex-grow flex flex-col justify-center items-center space-y-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
                <div class="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style="animation-delay: 0.1s" />
                <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s" />
              </div>
              <p class="text-sm text-slate-400 animate-pulse">
                正在阅读简历与 JD...
              </p>
            </div>

            <div v-if="errorMessage"
              class="flex-grow flex flex-col justify-center items-center text-red-400 p-4 bg-red-900/20 rounded-lg">
              <Icon name="lucide:alert-circle" class="w-12 h-12 mb-3" />
              <p class="text-center text-sm">{{ errorMessage }}</p>
            </div>

            <div v-if="analysisResult" class="animate-fade-in">
              <div class="flex items-end mb-4">
                <span
                  class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                  {{ analysisResult.score }}%
                </span>
                <span class="text-slate-400 ml-2 mb-1">匹配度</span>
              </div>
              <div class="prose prose-invert prose-sm max-w-none markdown-body"
                v-html="renderMarkdown(analysisResult.content)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import type { AnalysisResult } from '~/types/resume'

const jobDescription = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref<AnalysisResult | null>(null)
const errorMessage = ref('')

const { analyzeJobMatch } = useAgent()

const handleAnalyze = async () => {
  if (!jobDescription.value) return

  isAnalyzing.value = true
  analysisResult.value = null
  errorMessage.value = ''

  try {
    console.log('Starting analysis...')
    const result = await analyzeJobMatch(jobDescription.value)
    console.log('Analysis result:', result)

    if (result) {
      analysisResult.value = result
    } else {
      errorMessage.value = '分析失败，请检查 API Key 是否正确配置'
    }
  } catch (error) {
    console.error('Analysis error:', error)
    errorMessage.value = `发生错误: ${error instanceof Error ? error.message : '未知错误'}`
  } finally {
    isAnalyzing.value = false
  }
}

const renderMarkdown = (text: string) => {
  return marked.parse(text)
}
</script>

<style scoped>
.markdown-body :deep(p) {
  margin-bottom: 0.5em;
}

.markdown-body :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-bottom: 0.5em;
}

.markdown-body :deep(strong) {
  color: #2dd4bf;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
