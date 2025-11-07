<template>
  <td
    :class="[
      'px-6 py-4 whitespace-nowrap text-sm',
      bold ? 'font-medium text-gray-900' : 'text-gray-500',
      responsiveClass
    ]"
  >
    <slot />
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TableCellProps {
  bold?: boolean
  hideOn?: 'mobile' | 'tablet' | 'desktop' | never
}

const props = withDefaults(defineProps<TableCellProps>(), {
  bold: false,
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
