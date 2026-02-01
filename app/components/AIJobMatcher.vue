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

            <div v-if="isAnalyzing" class="flex-grow flex flex-col justify-center space-y-6">
              <!-- 进度条 -->
              <div class="w-full">
                <div class="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div
                    class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    :style="{ width: `${progress}%` }">
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {{ progress }}%
                  </span>
                </div>
              </div>

              <!-- 进度文字 -->
              <p class="text-sm text-slate-400 text-center animate-pulse">
                {{ progressText }}
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
// 进度条相关
const progress = ref(0)
const progressText = ref('正在初始化...')

// --------------------
// 进度条实现
// --------------------
const progressSteps = [
  { percent: 20, text: '正在读取简历数据...' },
  { percent: 40, text: '正在解析职位描述...' },
  { percent: 60, text: 'AI 正在分析匹配度...' },
  { percent: 80, text: '生成推荐语中...' },
  { percent: 95, text: '即将完成...' }
]

const startProgress = () => {
  progress.value = 0
  progressText.value = '开始分析...'

  let stepIndex = 0
  const interval = setInterval(() => {
    if (stepIndex < progressSteps.length) {
      progress.value = progressSteps[stepIndex].percent
      progressText.value = progressSteps[stepIndex].text
      stepIndex++
    }
  }, 2000)

  return () => clearInterval(interval)
}

const { analyzeJobMatch } = useAgent()

const handleAnalyze = async () => {
  if (!jobDescription.value) return

  isAnalyzing.value = true
  analysisResult.value = null
  errorMessage.value = ''

  const stopProgress = startProgress()

  try {
    console.log('Starting analysis...')
    const result = await analyzeJobMatch(jobDescription.value)
    console.log('Analysis result:', result)

    progress.value = 100
    progressText.value = '分析完成！'

    if (result) {
      analysisResult.value = result
    } else {
      errorMessage.value = '分析失败，请检查 API Key 是否正确配置'
    }
  } catch (error) {
    console.error('Analysis error:', error)
    errorMessage.value = `发生错误: ${error instanceof Error ? error.message : '未知错误'}`
  } finally {
    stopProgress()
    setTimeout(() => {
      isAnalyzing.value = false
      progress.value = 0
    }, 500)
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
