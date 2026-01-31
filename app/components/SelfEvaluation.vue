<template>
  <UCard class="shadow-md">
    <template #header>
      <div class="flex items-center gap-3">
        <Icon name="mdi:account-circle" size="32" class="text-blue-600" />
        <h3 class="text-2xl font-bold text-gray-900">自我评价</h3>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex items-start gap-3">
        <Icon name="mdi:translate" size="24" class="text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h4 class="font-semibold text-gray-900 mb-1">英语水平</h4>
          <p class="text-gray-600">通过 <span class="font-semibold">CET6</span>，可流畅阅读英文技术文档。</p>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <Icon name="mdi:brain" size="24" class="text-purple-600 flex-shrink-0 mt-1" />
        <div>
          <h4 class="font-semibold text-gray-900 mb-1">综合特质</h4>
          <p class="text-gray-600 leading-relaxed">
            利用心理学背景，在项目协作中能更好地理解用户需求及同理心设计；
            对技术迭代保持高度敏感与持续学习的热情。
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// Static content based on resume.md
</script>
