<template>
  <div id="main-wrapper" class="min-h-screen flex flex-col bg-slate-50">
    <!-- Navigation Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Name -->
          <div class="flex-shrink-0">
            <a href="#about" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              高一帆
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-center space-x-8">
              <a
                v-for="item in navItems"
                :key="item.id"
                :href="item.href"
                class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {{ item.label }}
              </a>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Icon v-if="!mobileMenuOpen" name="mdi:menu" size="28" />
              <Icon v-else name="mdi:close" size="28" />
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-400">
            &copy; {{ new Date().getFullYear() }} 高一帆. All rights reserved.
          </p>
          <div class="mt-4 flex justify-center space-x-6">
            <a
              href="https://github.com/EafenQAQ"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Icon name="mdi:github" size="24" />
            </a>
            <a
              href="mailto:15847007426@163.com"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Icon name="mdi:email" size="24" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navItems = [
  { id: 'about', label: '关于', href: '#about' },
  { id: 'projects', label: '项目', href: '#projects' },
  { id: 'skills', label: '技能', href: '#skills' },
  { id: 'education', label: '教育', href: '#education' },
]
</script>