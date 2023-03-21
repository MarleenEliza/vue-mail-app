<script setup lang="ts">
import MailItem from "../components/MailItem.vue";
import IconArrow1 from "../components/icons/IconArrow1.vue";
import IconArrow2 from "../components/icons/IconArrow2.vue";

import type { Mail } from "../types/types";

const emit = defineEmits(["update:openMail"]);
defineProps<{
  data: Array<Mail>;
}>();
</script>

<template>
  <section class="mail-overview">
    <h3 class="title">
      Results: <strong>{{ results.length }}</strong
      >mail(s)
    </h3>
    <header>
      <button
        v-for="[key, val] of Object.entries(SortKey)"
        :key="key"
        :class="{ '-selected': sortObj.key === val }"
        @click="sort(val)"
      >
        {{ key.toLowerCase() }}
        <IconArrow1
          v-if="val === sortObj.key && sortObj.direction === SortDirection.ASC"
          :class="`-${sortObj.direction}`"
          class="s"
        />
        <IconArrow2
          v-else-if="
            val === sortObj.key && sortObj.direction === SortDirection.DESC
          "
          :class="`-${sortObj.direction}`"
          class="s"
        />
      </button>
    </header>
    <ul class="results">
      <MailItem
        v-for="result of results"
        :key="result.id"
        v-bind="result"
        @click="emit('update:openMail', { ...result })"
      ></MailItem>
    </ul>
  </section>
</template>

<script lang="ts">
enum SortKey {
  FROM = "sender",
  TO = "recipants",
  SUBJECT = "subject",
  DATE = "date",
}

enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}
const emptySortObj = {
  key: null as null | SortKey,
  direction: null as null | SortDirection,
};

export default {
  data() {
    return {
      sortObj: { ...emptySortObj },
    };
  },
  computed: {
    // TODO: refactor
    results() {
      const key = this.sortObj.key;
      if (!key) return this.data;

      return [...this.data].sort(this.sortData);
    },
  },
  methods: {
    // EXCEPTION - throw error in case of sorting without sort key(should be impossible)
    // sort by string: in case of string[] such as 'recipants' prop, the item of first alphabetical order will be used
    sortData(a: Mail, b: Mail) {
      const key = this.sortObj.key;
      if (!key) throw Error("forbidden call on sortData");
      const [aProp, bProp] = [a[key], b[key]];
      const [itemA, itemB] =
        typeof aProp === "object" && typeof bProp === "object"
          ? [aProp.sort()[0], bProp.sort()[0]]
          : ([aProp, bProp] as [string, string]);
      return this.sortObj.direction === SortDirection.ASC
        ? itemA.localeCompare(itemB)
        : itemB.localeCompare(itemA);
    },
    // IF - reset if same key and end of cycle(order === desc)
    // ELSE IF - change direction if same key
    // ELSE - set new sort key
    sort(key: SortKey) {
      if (
        key === this.sortObj.key &&
        this.sortObj.direction === SortDirection.DESC
      ) {
        this.sortObj = { ...emptySortObj };
      } else if (key === this.sortObj.key) {
        this.sortObj.direction =
          this.sortObj.direction === SortDirection.ASC
            ? SortDirection.DESC
            : SortDirection.ASC;
      } else {
        this.sortObj = {
          key,
          direction: (this.sortObj.direction = SortDirection.ASC),
        };
      }
    },
  },
};
</script>

<style>
.mail-overview h3,
.filter {
  padding: var(--padding-horizontal);
}
@media (min-width: 800px) {
  .mail-overview h3,
  .filter {
    padding: 0;
  }
}

.mail-overview h3.title {
  font-weight: bold;
  color: var(--color-main);
}
.mail-overview h3.title strong {
  font-size: 1.5rem;
  margin: 0 0.1rem 0 0.2rem;
}

.mail-overview header {
  padding: var(--padding-default);
  border-radius: 1rem 1rem 0 0;
  background-color: var(--color-hover);
}
@media (min-width: 800px) {
  .mail-overview header {
    display: grid;
    gap: var(--gap-inner-grid-large);
    grid-template-columns: 10vw 20vw auto 5rem;
  }
}
.mail-overview header button {
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  gap: var(--gap-inner-grid);
  font-weight: bold;
}
.mail-overview header button::after {
  content: "|";
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
.mail-overview header button:last-child::after {
  content: none;
}
@media (min-width: 800px) {
  .mail-overview header button::after {
    content: none;
  }
}
.mail-overview header button.-selected {
  color: var(--color-secondary);
}
.mail-overview header button.-selected .icon.-desc {
  transform: scaleY(-1);
}
</style>
