<template>
  <nav class="fixed w-full z-50 transition-all duration-300"
    :class="{ 'glass-card py-4 shadow-lg': isScrolled, 'py-6 bg-transparent': !isScrolled }">
    <div class="container mx-auto px-6 flex justify-between items-center">
      <a href="#" class="text-2xl font-bold tracking-tighter hover:text-indigo-400 transition-colors">
        &lt;Eafen /&gt;
      </a>

      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8 text-sm font-medium">
        <a v-for="item in navItems" :key="item.name" :href="item.href"
          class="hover:text-teal-400 transition-colors relative group">
          {{ item.name }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full" />
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-white focus:outline-none rounded-md hover:bg-white/10 hover:cursor-pointer"
        @click="mobileMenuOpen = !mobileMenuOpen">

        <div class="relative w-6 h-6">
          <Transition name="icon-rotate">
            <!-- 汉堡图标 -->
            <Icon v-if="!mobileMenuOpen" key="menu" name="lucide:menu" class="absolute inset-0  w-6 h-6" />
            <!-- 关闭图标 -->
            <Icon v-else key="close" name="lucide:x" class="absolute inset-0  w-6 h-6" />
          </Transition>
        </div>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen"
        class="md:hidden glass-card absolute w-full left-0 top-full p-4 flex flex-col space-y-4">
        <a v-for="item in navItems" :key="item.name" :href="item.href" @click="mobileMenuOpen = false"
          class="block hover:text-teal-400">
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

.icon-rotate-enter-active,
.icon-rotate-leave-active {
  transition: all .3s ease;
}

.icon-rotate-enter-from {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}

.icon-rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}
</style>
