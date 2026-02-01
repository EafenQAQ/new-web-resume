<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <!-- Chat Window -->
    <Transition name="fade">
      <div v-if="chatOpen"
        class="mb-4 w-80 md:w-96 glass-card rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-teal-500/30">
        <!-- Header -->
        <div class="p-4 bg-slate-900/80 border-b border-slate-700 flex justify-between items-center">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 flex items-center justify-center text-xs font-bold mr-3 text-white">
              AI
            </div>
            <div>
              <h4 class="font-bold text-sm">Virtual Eafen</h4>
              <p class="text-xs text-green-400 flex items-center">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button @click="chatOpen = false" class="text-slate-400 hover:text-white">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Messages -->
        <div ref="chatContainer" class="h-80 overflow-y-auto p-4 space-y-4 bg-slate-900/40">
          <div v-for="(msg, i) in chatHistory" :key="i" :class="{
            'flex justify-end': msg.role === 'user',
            'flex justify-start': msg.role === 'model'
          }">
            <div :class="{
              'bg-indigo-600 text-white': msg.role === 'user',
              'bg-slate-700 text-slate-200': msg.role === 'model'
            }" class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md">
              <p>{{ msg.text }}</p>
            </div>
          </div>
          <div v-if="isChatting" class="flex justify-start">
            <div class="bg-slate-700 rounded-2xl px-4 py-3 shadow-md flex space-x-1">
              <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s" />
              <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s" />
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 bg-slate-900/80 border-t border-slate-700">
          <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
            <input v-model="userMessage" type="text" placeholder="问我任何关于简历的问题..."
              class="flex-grow bg-slate-800 border border-slate-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500" />
            <button type="submit" :disabled="!userMessage || isChatting"
              class="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Icon name="lucide:send" class="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Toggle Button -->
    <button @click="chatOpen = !chatOpen"
      class="w-14 h-14 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full shadow-lg shadow-indigo-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 group cursor-pointer">
      <Icon v-if="!chatOpen" name="lucide:message-square-more" class="w-7 h-7" />
      <Icon v-else name="lucide:chevron-down" class="w-7 h-7" />
      <!-- Notification Dot -->
      <span v-if="!chatOpen" class="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types/resume'

const chatOpen = ref(false)
const userMessage = ref('')
const isChatting = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const chatHistory = ref<ChatMessage[]>([
  {
    role: 'model',
    text: '你好！我是高一帆的 AI 助手。你可以问我关于他的项目经验、技术栈，或者为什么从心理学转行前端开发？',
  },
])

const { chatWithResume } = useAgent()

const sendMessage = async () => {
  if (!userMessage.value.trim()) return

  const userText = userMessage.value
  chatHistory.value.push({ role: 'user', text: userText })
  userMessage.value = ''
  isChatting.value = true

  // Auto scroll
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }

  const responseText = await chatWithResume(userText)

  chatHistory.value.push({ role: 'model', text: responseText })
  isChatting.value = false

  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
