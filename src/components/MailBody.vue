<script setup lang="ts">
import IconCalendar from "./icons/IconCalendar.vue";
import IconReturn from "./icons/IconReturn.vue";

import { computed } from "vue";
const emit = defineEmits(["update:openMail"]);

const props = defineProps<{
  sender: string;
  recipants: string[];
  date: string;
  subject: string;
  content: string;
  attachment?: unknown;
}>();

const formattedDate = computed(() => {
  const date = new Date(props.date);

  return {
    date: date.toISOString().slice(0, 10).replace(/-/g, "/"),
    time: date.toTimeString().slice(0, 5),
  };
});
</script>

<template>
  <section>
    <button @click="emit('update:openMail', null)">
      <IconReturn></IconReturn>
    </button>
    <h2>
      <strong>{{ subject }}</strong>
    </h2>
    <p class="sender">{{ sender }}</p>
    <p class="recipants">
      <span v-for="(recipant, index) of recipants" :key="index">{{
        recipant
      }}</span>
    </p>
    <p>{{ content }}</p>
    <time :datetime="date" class="date">
      <IconCalendar class="m"></IconCalendar>
      {{ formattedDate.date }}
      {{ formattedDate.time }}
    </time>
  </section>
</template>
<style scoped>
p {
  word-break: break-word;
}
p.sender,
p.recipants {
  color: var(--color-main);
}
time.date {
  height: 3rem;
  display: flex;
  align-items: center;
  gap: var(--gap-inner-grid);
}
</style>
