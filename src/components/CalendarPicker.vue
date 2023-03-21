<script setup lang="ts">
import IconCalendar from "../components/icons/IconCalendar.vue";
import IconSearch from "../components/icons/IconSearch.vue";
import { computed, ref } from "vue";

const emit = defineEmits(["update:startDate", "update:endDate"]);

const props = defineProps<{
  startDate: Date;
  endDate: Date;
}>();

const formatDate = (date: Date) =>
  date.toISOString().slice(0, 10).replace(/-/g, "/");

const startStr = ref(formatDate(props.startDate));
const endStr = ref(formatDate(props.endDate));

const areValidDates = computed(() => {
  const [start, end] = [startStr.value, endStr.value];
  const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
  return (
    start.match(dateReg) &&
    end.match(dateReg) &&
    Date.parse(start) &&
    Date.parse(end)
  );
});

function emitDate(type: "start" | "end") {
  if (areValidDates.value) {
    emit(
      `update:${type}Date`,
      new Date(type === "start" ? startStr.value : endStr.value)
    );
  }
}
</script>

<template>
  <div class="calendar">
    <div class="content">
      <IconCalendar></IconCalendar>
      <input
        @input="emitDate('start')"
        v-model="startStr"
        type="text"
        maxlength="10"
        required
      />
      -
      <input
        @input="emitDate('end')"
        v-model="endStr"
        type="text"
        maxlength="10"
        required
      />
    </div>
    <button class="search"><IconSearch></IconSearch></button>
  </div>
  <small v-show="!areValidDates" class="error">
    Please enter valid dates in the format YYYY/MM/DD</small
  >
</template>

<style>
.calendar {
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
  width: max-content;
}
.calendar .content,
.calendar .search {
  padding: var(--padding-slim);
}

.calendar .content {
  display: flex;
  box-shadow: inset 0px 0px 4px -1px rgb(0 0 0 / 20%);
  align-items: center;
  gap: var(--gap-inner-grid);
}
.calendar .content input {
  width: 5rem;
}

.calendar .search {
  border-top-right-radius: 0.5rem;
  transform: translateZ(0);
  border-bottom-right-radius: inherit;
  background-color: var(--color-hover);
}
.error {
  position: absolute;
  color: var(--color-error);
}
</style>
