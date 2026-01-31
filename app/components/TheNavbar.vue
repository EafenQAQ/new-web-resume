<template>
  <nav
    class="fixed w-full z-50 transition-all duration-300"
    :class="{ 'glass-card py-4 shadow-lg': isScrolled, 'py-6 bg-transparent': !isScrolled }"
  >
    <div class="container mx-auto px-6 flex justify-between items-center">
      <a
        href="#"
        class="text-2xl font-bold tracking-tighter hover:text-indigo-400 transition-colors"
      >
        &lt;GYF /&gt;
      </a>

      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8 text-sm font-medium">
        <a
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          class="hover:text-teal-400 transition-colors relative group"
        >
          {{ item.name }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full" />
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden text-white focus:outline-none"
      >
        <Icon v-if="!mobileMenuOpen" name="lucide:menu" class="w-6 h-6" />
        <Icon v-else name="lucide:x" class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden glass-card absolute w-full left-0 top-full p-4 flex flex-col space-y-4"
      >
        <a
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          @click="mobileMenuOpen = false"
          class="block hover:text-teal-400"
        >
          {{ item.name }}
        </a>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { navItems } from '~/constants/resume'

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})
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
