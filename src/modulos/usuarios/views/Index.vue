<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useMainStore } from '@/stores/index';
import { getUsers, deleteUser, getUsersPdf } from "@/services/userApi";
import { useRouter, useRoute } from 'vue-router';
import showNotify, { TypeNotification } from '@/utils/notifications';
import { StatusCodes } from '@/utils/statusCodes';
import { openPdfNewTab } from '@/utils/pdf';

const store = useMainStore();
const router = useRouter();
const route = useRoute();

const selectedId = ref<string|null>(null);
const walink = 'https://api.whatsapp.com/send?phone=';
const filterState = ref(true);
const search = ref('');
const isLoadingTable = ref(true);
const fields = reactive([
  {
    key: 'editar', label: ' ', thStyle: { width: '3%' },
  },
  {
    key: 'eliminar', label: ' ', thStyle: { width: '3%' },
  },
  {
    key: 'usuario_id', label: 'Id', sortable: true, thStyle: { width: '5%' },
  },
  {
    key: 'full_name', label: 'Nombre Completo', thStyle: { width: '20%' },
  },
  {
    key: 'cargo', label: 'Cargo', thStyle: { width: '19%' },
  },
  {
    key: 'rol', label: 'Rol', thStyle: { width: '19%' },
  },
  {
    key: 'telefono', label: 'Teléfono', thStyle: { width: '10%' },
  },
  {
    key: 'correo', label: 'Correo', thStyle: { width: '21%' },
  },
]);
const items = ref<any[]>([]);
const perPage = ref(10);
const currentPage = ref(1);
const totalRows = ref(0);
const searchTimeOut = ref<any>(null);
const isLoadingPDF = ref(false);
const modalEliminar = ref(false);

function goToCreateRoute() {
  if ( route.name !== 'usuario-create') {
    router.push({ name: 'usuario-create' });
  }
}

function openModalEliminar(id:string) {
  selectedId.value = id;
  modalEliminar.value = true;
}

async function generarPDF() {
  if (isLoadingPDF.value) {
    return;
  }
  isLoadingPDF.value = true;
  try {
    const response = await getUsersPdf();
    openPdfNewTab(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingPDF.value = false;
  }
}

async function getUsuariosApi() {
  isLoadingTable.value = true;
  const params = {
    filter: search.value,
    page: currentPage.value,
    state: filterState.value,
  };
  try {
    const response = await getUsers(params);
    items.value = response.data.usuarios.data;
    totalRows.value = response.data.usuarios.total;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingTable.value = false;
  }
}

async function deleteItem() {
  modalEliminar.value = false;
  if (selectedId.value === null) {
    return;
  }
  try {
    items.value = items.value.filter((el) => el.usuario_id !== selectedId.value);
    const response = await deleteUser(selectedId.value);
    selectedId.value = null;
    if (response.status === StatusCodes.deleted) {
      showNotify('Registro Eliminado', 'Se elimino el registro correctamente.', TypeNotification.Ok);
    } else {
      showNotify('No se pudo eliminar el registro', response.data.message, TypeNotification.Error);
    }
  } catch (error) {
    console.log(error);
  } finally {
    getUsuariosApi();
  }
}

function encodeBase64(data: string) {
  return window.btoa(data);
}

function searchFromInput() {
  clearTimeout(searchTimeOut.value);
  searchTimeOut.value = setTimeout(getUsuariosApi, 500);
}

onMounted(()=> {
  store.setNavigationTitle('Lista de usuarios');
});
getUsuariosApi();
</script>

<template>
  <va-card>
    <div class="row">
      <div class="row flex md9 pb-0">
        <div class="flex md2" style="text-align: center">
          <va-button
            color="info"
            class="mr-2"
            @click="goToCreateRoute"
          >Nuevo</va-button>
        </div>
        <div class="flex md5">
          <va-button-group color="secondary" outline class="mr-2">
            <va-button>Cargos</va-button>
            <va-button>Roles</va-button>
            <va-button>Permisos</va-button>
          </va-button-group>
        </div>
        <div class="flex md1 pl-0">
          <img
            @click="generarPDF"
            title="lista de usuarios"
            height="36"
            src="@/assets/pdf_icon.svg"
            :style="isLoadingPDF? 'cursor:wait':'cursor:pointer'"
          >
        </div>
      </div>
      <div class="flex md2 offset--md1 pt-3">
        <va-switch
          v-model="filterState"
          @update:modelValue="getUsuariosApi"
          :label="filterState? 'Activos' : 'Inactivos'"
          size="small"
        />
      </div>
    </div>
    <va-divider class="mt-0"></va-divider>
    <div class="row mb-3">
      <div class="flex md3 ml-3">
        <va-input
          v-model="search"
          @keyup="searchFromInput"
          label="Buscar"
          placeholder="Escriba un nombre"
        >
          <template #prependInner>
            <va-icon
              name="search"
            />
          </template>
        </va-input>
      </div>
    </div>
    <div class="row mx-0">
      <va-data-table
        no-data-html="No hay datos"
        striped
        :items="items"
        :columns="fields"
        :loading="isLoadingTable"
      >
        <template #cell(telefono)="{ rowData }">
          <a
            :href="walink+rowData.prefijo_llamada+rowData.telefono"
            target="_blank"
          >{{rowData.telefono}}</a>
        </template>
        <template #cell(editar)="{ rowData }">
          <router-link
            v-if="filterState"
            :to="{ name: 'usuario-edit', params: { id: encodeBase64(rowData.usuario_id) } }"
          >
            <va-icon name="edit" color="secondary"/>
          </router-link>
        </template>
        <template #cell(eliminar)="{ rowData }">
          <va-icon
            v-if="filterState"
            @click="openModalEliminar(rowData.usuario_id)"
            name="delete_outline"
            color="danger"
            style="cursor:pointer"
          />
        </template>
      </va-data-table>
    </div>
    <div class="row mt-3">
      <div class="flex offset--md8 md4">
        <va-pagination
          @update:model-value="getUsuariosApi"
          v-model="currentPage"
          :visible-pages="3"
          :total="totalRows"
          :page-size="perPage"
          boundary-numbers
        />
      </div>
    </div>
    <va-modal
      v-model="modalEliminar"
      size="small"
      title="Eliminar Usuario"

      hide-default-actions
      cancel-text="Cancelar"
      ok-text="Eliminar"
    >
      <p class="my-2">
        ¿Desea eliminar el registro con Id: <b>{{selectedId}}</b> ?
      </p>
      <template #footer>
        <va-button
          class="mr-2"
          @click="modalEliminar = false"
          color="secondary"
        >
          Cancelar
        </va-button>
        <va-button
          @click="deleteItem"
          color="danger"
        >
          Eliminar
        </va-button>
      </template>
    </va-modal>    
  </va-card>
</template>