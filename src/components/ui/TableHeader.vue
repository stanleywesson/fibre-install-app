<template>
  <th
    :class="[
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      responsiveClass
    ]"
  >
    <slot />
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TableHeaderProps {
  hideOn?: 'mobile' | 'tablet' | 'desktop' | never
}

const props = withDefaults(defineProps<TableHeaderProps>(), {
  hideOn: 'never'
})

const responsiveClass = computed(() => {
  const classes = {
    mobile: 'hidden sm:table-cell',
    tablet: 'hidden md:table-cell',
    desktop: 'hidden lg:table-cell',
    never: ''
  }
  return classes[props.hideOn]
})
</script>
