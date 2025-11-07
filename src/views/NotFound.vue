<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="text-9xl font-bold text-blue-600">404</h2>
        <h3 class="mt-6 text-3xl font-extrabold text-gray-900">
          Page Not Found
        </h3>
        <p class="mt-2 text-sm text-gray-600">
          The page you're looking for doesn't exist.
        </p>
      </div>
      <div class="mt-8">
        <RouterLink
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
