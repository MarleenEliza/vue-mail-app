<script setup lang="ts">
import CalendarPicker from "./components/CalendarPicker.vue";
import data from "./utils/data.json";
import type { Mail } from "./types/types";
import MailOverview from "./components/MailOverview.vue";
import MailBody from "./components/MailBody.vue";
import { computed, ref } from "vue";

const openMail = ref(null as null | Mail);
const startDate = ref(
  new Date(Math.min(...data.map(({ date }) => new Date(date).valueOf())))
);
const endDate = ref(new Date());

const filteredData = computed(() =>
  data.filter(
    (item) =>
      new Date(item.date) >= startDate.value &&
      new Date(item.date) <= endDate.value
  )
);
</script>

<template>
  <main :class="{ 'open-mail': openMail }">
    <section class="filter">
      <CalendarPicker
        v-model:start-date="startDate"
        v-model:end-date="endDate"
      />
    </section>
    <MailOverview
      v-model:openMail="openMail"
      :data="filteredData"
    ></MailOverview>
    <MailBody v-bind="openMail" v-model:openMail="openMail" v-if="openMail" />
  </main>
</template>

<style>
@import "./assets/base.css";

main.open-mail .mail-overview {
  display: none;
}
</style>
