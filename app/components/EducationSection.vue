<template>
  <UCard class="shadow-md">
    <template #header>
      <div class="flex items-center gap-3">
        <Icon name="mdi:school" size="32" class="text-blue-600" />
        <h3 class="text-2xl font-bold text-gray-900">教育经历</h3>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="mdi:account-tie" size="24" class="text-blue-600" />
          </div>
        </div>
        <div class="flex-1">
          <h4 class="text-xl font-semibold text-gray-900">济南大学</h4>
          <p class="text-gray-700 mt-1">教育学学士 (应用心理学专业)</p>
          <p class="text-sm text-gray-500 mt-2">2019.09 - 2023.06</p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// Static content based on resume.md
</script>
