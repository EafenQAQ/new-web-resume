<template>
  <UCard class="shadow-md">
    <template #header>
      <div class="flex items-center gap-3">
        <Icon v-if="icon" :name="icon" size="32" class="text-blue-600" />
        <h3 class="text-xl font-bold text-gray-900">{{ category }}</h3>
      </div>
    </template>

    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="skill in skills"
        :key="skill"
        size="lg"
        color="blue"
        variant="subtle"
      >
        {{ skill }}
      </UBadge>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  category: string
  skills: string[]
  icon?: string
}>()
</script>
