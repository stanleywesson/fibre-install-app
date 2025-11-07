<template>
  <span
    :class="[
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
      variantClasses
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'blue' | 'green' | 'gray' | 'orange' | 'red'
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'gray'
})

const variantClasses = computed(() => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    gray: 'bg-gray-100 text-gray-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800'
  }

  return variants[props.variant]
})
</script>
