<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <slot name="header" />
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <slot name="body" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Simple table wrapper component for consistent styling
// Usage:
// <Table>
//   <template #header>
//     <TableHeader>Name</TableHeader>
//     <TableHeader>Email</TableHeader>
//   </template>
//   <template #body>
//     <tr>
//       <TableCell>John</TableCell>
//       <TableCell>john@example.com</TableCell>
//     </tr>
//   </template>
// </Table>
</script>
