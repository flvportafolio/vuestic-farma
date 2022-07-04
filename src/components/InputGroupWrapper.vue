<template>
  <div class="va-input-wrapper va-input-wrapper--solid">
    <div class="va-input-wrapper__container">
      <div class="va-input-wrapper__field">
        <div class="va-input-wrapper__text">
          <slot>
          </slot>
        </div>
        <div class="va-input-wrapper__append-inner">
          <slot name="header"></slot>°C
        </div>
      </div>
    </div>    
  </div>
</template>