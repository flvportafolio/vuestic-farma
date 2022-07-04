<script setup lang="ts">
import { useSlots } from 'vue';

defineProps<{ isFocused: boolean }>()
const slots = useSlots();
const hasSlot = (name: string) => {
  return !!slots[name];
}
</script>

<template>
  <div
    class="va-input-wrapper va-input-wrapper--solid "
    :class="isFocused? 'va-input-wrapper--focused': ''"
  >
    <div class="va-input-wrapper__container">
      <div class="va-input-wrapper__field">
        <div class="va-input-wrapper__text">
          <slot>
          </slot>
        </div>
        <div v-if="hasSlot('appendInner')" class="va-input-wrapper__append-inner">
          <slot name="appendInner"></slot>
        </div>
      </div>
    </div>
  </div>
</template>