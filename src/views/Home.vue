<script setup lang="ts">
import { onMounted } from 'vue';
import { useMainStore } from '@/stores/index';

const store = useMainStore();

onMounted(()=> {
  store.setNavigationTitle('Menu principal');
});
</script>
<template>
  <va-card>
    <div class="row px-4">
      <div class="flex md-12">
        <h4 class="mb-4">La app usa vuestic ui y es solo para pruebas</h4>
        <va-divider></va-divider>
        <h5>Detalles</h5>
        <ul>
          <li>
            - Hay Cambios importantes con respecto al proyecto original para aprovechar nuevas funcionalidades.
          </li>
          <li>
            - algunos componentes de vuestic ui no funcionan correctamente
          </li>
          <li>
            - para que funcionen se necesita agregar logica manualmente.
          </li>
        </ul>
      </div>
    </div>
  </va-card>
</template>