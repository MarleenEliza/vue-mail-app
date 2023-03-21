<script setup lang="ts">
import MailSPIcon from "./icons/IconMailsp.vue";
import ClipIcon from "./icons/IconClip.vue";
import ArrowIcon from "./icons/IconArrow2.vue";
import RecipantBadge from "./RecipantBadge.vue";
import { ref, computed } from "vue";

const props = defineProps<{
  id: number;
  sender: string;
  recipants: string[];
  date: string;
  subject: string;
  content: string;
  attachment?: unknown;
}>();

const formattedDate = computed(() => {
  const today = new Date();
  const date = new Date(props.date);
  return date.toLocaleDateString() === today.toLocaleDateString()
    ? date.toTimeString().slice(0, 5)
    : date.getFullYear() === today.getFullYear()
    ? date.toDateString().slice(4, 10)
    : date.toISOString().slice(0, 10).replace(/-/g, "/");
});

const overFlownChildren = ref(0);

const vOverflowDirective = (el: HTMLElement) => {
  if (!recipantsRef.value) return;
  if (
    el.offsetLeft + el.scrollWidth > recipantsRef?.value?.clientWidth &&
    recipantsRef?.value?.firstElementChild !== el
  ) {
    recipantsRef.value.removeChild(el);
    overFlownChildren.value++;
  }
};

const recipantsRef = ref(null as HTMLElement | null);
</script>

<template>
  <li class="mail-item">
    <MailSPIcon class="mail" />
    <p class="sender">{{ sender }}</p>
    <ClipIcon v-if="attachment" class="attachment" />
    <time :datetime="date" class="date"
      >{{ formattedDate }}
      <ArrowIcon class="arrow xs"></ArrowIcon>
    </time>
    <div class="recipants">
      <p ref="recipantsRef" :class="{ overflown: overFlownChildren > 0 }">
        <span
          v-overflow-directive="this"
          v-for="(recipant, index) of recipants"
          :key="index"
        >
          {{ recipant }}
        </span>
      </p>
      <RecipantBadge :n="overFlownChildren" />
    </div>

    <p class="subject">{{ subject }}</p>
  </li>
</template>

<style scoped>
.mail-item {
  display: grid;
  gap: var(--gap-inner-grid);
  grid-template-columns: 25px 1fr auto auto;
  grid-template-areas:
    "mail sender attachment date "
    "mail recipants recipants recipants"
    "subject    subject  subject subject  ";
  border-bottom: solid 1px var(--color-separator);
  padding: var(--padding-default);
}

@media (min-width: 800px) {
  .mail-item {
    gap: var(--gap-inner-grid-large);
    grid-template-columns: 10vw 20vw auto 20px 5rem;
    grid-template-areas: "sender recipants subject attachment date";
  }
  .mail-item * {
    font-size: 1rem !important;
  }
}
.mail-item:last-child {
  border-bottom: none;
}
.mail-item:hover {
  cursor: pointer;
  background-color: var(--color-hover);
  color: var(--color-highlight);
}
.mail-item:hover time.date {
  color: var(--color-text);
}

.mail-item p,
.mail-item time.date {
  white-space: nowrap;
}
.mail-item p,
.mail-item p span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.mail-item time.date {
  grid-area: date;
  display: flex;
  gap: var(--gap-inner-grid);
  text-align: right;
}
@media (min-width: 800px) {
  .mail-item time.date {
    font-weight: bold;
    text-align: left;
  }
}
.mail-item .sender {
  grid-area: sender;
  font-weight: bold;
}
.mail-item .recipants {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--gap-inner-grid);
  justify-content: space-between;
  grid-area: recipants;
}
.mail-item .recipants p {
  display: flex;
}
.mail-item .recipants p span::after {
  content: ",";
  margin-right: var(--gap-inner-grid);
}
.mail-item .recipants p span:last-child::after {
  content: none;
}
.mail-item .recipants p.overflown span:last-child:after {
  content: "...";
}
.mail-item .subject {
  grid-area: subject;
  font-size: 1.2rem;
}

.mail-item .icon {
  align-self: center;
}
.mail-item .icon.mail {
  grid-area: mail;
  height: 35px;
}
@media (min-width: 800px) {
  .mail-item .mail.icon,
  .mail-item .arrow.icon {
    display: none;
  }
}
.mail-item .icon.attachment {
  grid-area: attachment;
}
</style>
