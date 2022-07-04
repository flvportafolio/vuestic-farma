<template>
  <Navigation />
  <div style="display: flex;">
    <div style="height: 100vh">
      <va-sidebar
        textColor="dark"
        hoverable
        minimizedWidth="3.8rem"
        width="12rem"
      >
        <template v-for="(route, idx) in routes" :key="idx">
          <va-sidebar-item
            v-if="route.haveAccess"
            :to="{ name: route.name}"
            :active="isRouteActive(route.name)"
            :hover-color="route.disabled? 'danger': ''"
          >
            <va-sidebar-item-content>
              <va-icon :name="route.icon" />
              <va-sidebar-item-title>{{route.text}}</va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
        </template>
      </va-sidebar>
    </div>
    <div class="layout fluid gutter--xl">
      <router-view v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>    
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import Navigation from './Navigation.vue';
import { useMainStore } from '@/stores/index';

const route = useRoute();
const store = useMainStore();
const routes = reactive([
  { 
    name: 'dashboard',
    text: 'Inicio',
    icon: 'dashboard',
    haveAccess: true,
    disabled: false,
  },
  {
    name: 'usuario-index',
    text: 'Usuarios',
    icon: 'people',
    haveAccess: computed(() => store.canListarUsuarios),
    disabled: false,
  },
  {
    name: 'producto-index',
    text: 'Productos',
    icon: 'category',
    haveAccess: computed(() => store.canListarProductos),
    disabled: false,
  },
  {
    name: 'proveedor-index',
    text: 'Proveedores',
    icon: 'groups',
    haveAccess: true,
    disabled: true,
  },
  {
    name: 'pedido-index',
    text: 'Pedidos',
    icon: 'fact_check',
    haveAccess: true,
    disabled: true,
  },
  {
    name: 'inventario-index',
    text: 'Inventario',
    icon: 'inventory_2',
    haveAccess: true,
    disabled: true,
  },
  {
    name: 'reportes-index',
    text: 'Reportes',
    icon: 'description',
    haveAccess: true,
    disabled: true,
  },
]);

function isRouteActive (actualRouteName: string) {
  return route.name === actualRouteName;
}
</script>

<style>
body { background: #d2d6de94; }
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* uso global */
.border {
  border: 1px solid #dee2e6!important;
}
.text-danger {
  color: var(--va-danger);
}
.text-center {
  text-align: center;
}
.text-rigth {
  text-align: right;
}
.font-weight-bold {
  font-weight: bold;
}

.table-responsive {
  overflow: auto;
}

.va-data-table__table {
  white-space: normal !important;
  width: 100% !important;
}

</style>
