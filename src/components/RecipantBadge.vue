<script setup lang="ts">
defineProps<{
  n: number;
}>();
</script>

<template>
  <strong v-if="n > 0" class="badge">+{{ n }}</strong>
</template>

<style scoped>
.badge {
  font-size: 0.9rem;
  color: white;
  line-height: 1;
  place-self: center;
  padding: 0.2rem;
  border-radius: 20%;
  background: var(--color-main);
}
</style>
