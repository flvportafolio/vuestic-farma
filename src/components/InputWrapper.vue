<script lang="ts">
import { defineComponent, useSlots } from 'vue';

export default defineComponent({
  props: {
    isFocused: {
      type: Boolean,
      required: true,
    }
  },
  setup() {
    const slots = useSlots();

    function  hasSlot(name: string) {
      return !!slots[name];
    }

    return {
      hasSlot
    };
  }
});
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