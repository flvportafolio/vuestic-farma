<script setup lang="ts">
import { computed  } from 'vue';
import $axios from '@/axiosConfig';
import { useMainStore } from '@/stores/index';

const store = useMainStore();

function logout() {
  $axios.post('logout');
  store.logout();
}

const getUserName = computed(() => {
  return store.user?.nombre_usuario ?? '';
});


</script>

<template>
  <va-navbar color="primary" shape>
    <template #left>
      <va-navbar-item class="display-6" style="color:white">Farmacia Fabio</va-navbar-item>
    </template>
    <template #center>
      <va-navbar-item class="display-6">{{store.navigationTitle}}</va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item>
        <va-button-dropdown
          color="white" :label="getUserName" flat
        >
          <va-sidebar-item :to="{ name: 'profile' }" active>
            <va-sidebar-item-content class="py-2">
              <va-sidebar-item-title>
                Mi perfil
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item>
            <va-sidebar-item-content class="py-2">
              <va-sidebar-item-title>
                Módulos
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item>
            <va-sidebar-item-content class="py-2">
              <va-sidebar-item-title>
                Empresas
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item>
            <va-sidebar-item-content class="py-2">
              <va-sidebar-item-title>
                 Formas de Pago
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item>
            <va-sidebar-item-content class="py-2">
              <va-sidebar-item-title>
                Países
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-divider />
          <va-sidebar-item>
            <va-sidebar-item-content class="py-2 cursor-pointer">
              <va-sidebar-item-title @click="logout">
                Cerrar sesión
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
        </va-button-dropdown>
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<style>
.cursor-pointer {
  cursor:pointer;
}
</style>