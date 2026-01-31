<template>
  <UCard class="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
    <template #header>
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ project.name }}</h3>
          <p class="text-sm text-gray-600">{{ project.role }}</p>
        </div>
        <div class="flex gap-2">
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-gray-900"
            aria-label="View on GitHub"
          >
            <Icon name="mdi:github" size="28" />
          </a>
          <a
            v-if="project.demoUrl"
            :href="project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800"
            aria-label="View live demo"
          >
            <Icon name="mdi:open-in-new" size="28" />
          </a>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Tech Stack -->
      <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-2">技术栈</h4>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tech in project.techStack"
            :key="tech"
            color="blue"
            variant="soft"
          >
            {{ tech }}
          </UBadge>
        </div>
      </div>

      <!-- Description -->
      <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-2">项目描述</h4>
        <p class="text-gray-600 text-sm leading-relaxed">{{ project.description }}</p>
      </div>

      <!-- Highlights -->
      <div v-if="project.highlights.length > 0">
        <h4 class="text-sm font-semibold text-gray-700 mb-2">项目亮点</h4>
        <ul class="space-y-2">
          <li
            v-for="(highlight, index) in project.highlights"
            :key="index"
            class="text-sm text-gray-600 flex items-start gap-2"
          >
            <Icon name="mdi:check-circle" class="text-green-500 flex-shrink-0 mt-0.5" size="16" />
            <span>{{ highlight }}</span>
          </li>
        </ul>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Project {
  name: string
  role: string
  techStack: string[]
  description: string
  highlights: string[]
  githubUrl?: string
  demoUrl?: string
}

defineProps<{
  project: Project
}>()
</script>
