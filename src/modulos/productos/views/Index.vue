<script>
import { getProducts, deleteProduct, getProductsPdf } from "@/services/productApi";
import showNotify, { TypeNotification } from '@/utils/notifications';
import { StatusCodes } from '@/utils/statusCodes';
import { openPdfNewTab } from '@/utils/pdf';
import ModalClasificacion from './components/ModalClasificacion.vue';

export default {
  name: 'Index',
  components: {
    ModalClasificacion,
  },
  created() {
    this.getProductosApi();
  },
  data() {
    return {
      selectedId: null,
      search: '',
      filterState: true,
      isLoadingTable: true,
      fields: [
        {
          key: 'editar', label: ' ', width: '3%',
        },
        {
          key: 'eliminar', label: ' ', width: '3%',
        },
        {
          key: 'id', label: 'Id', sortable: true, width: '5%',
        },
        {
          key: 'nombre', label: 'Nombre', sortable: true, width: '17%',
        },
        {
          key: 'codigo_barra', label: 'Código de Barra', width: '12%',
        },
        {
          key: 'foto', label: 'Foto', width: '10%',
        },
        {
          key: 'empresa', label: 'Empresa', sortable: true, width: '15%',
        },
        {
          key: 'stock_minimo', label: 'Stock mínimo', width: '11%',
        },
        {
          key: 'descripcion', label: 'Descripción', width: '24%',
          /*tdStyle: { whiteSpace: 'normal' } */
        },
      ],
      items: [],
      selectedRadio: '1',
      optionsRadio: [
        { text: 'Todos', value: '1' },
        { text: 'Medicamentos', value: '2' },
        { text: 'Varios', value: '3' },
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      searchTimeOut: null,
      isLoadingPDF: false,
      modalEliminar: false,
      modalClasificacion: false,
    };
  },
  methods: {
    goToCreateRoute() {
      if (this.$route.name !== 'producto-create') {
        this.$router.push({ name: 'producto-create' });
      }
    },
    encodeBase64(data) {
      return window.btoa(data);
    },
    searchFromInput() {
      clearTimeout(this.searchTimeOut);
      this.searchTimeOut = setTimeout(this.getProductosApi, 500);
    },
    onChangeTipoVista() {
      if (this.selectedRadio === '2') {
        this.fields = [
          {
            key: 'editar', label: '', width: '3%',
          },
          {
            key: 'eliminar', label: '', width: '3%',
          },
          {
            key: 'id', label: 'Id', sortable: true, width: '5%',
          },
          {
            key: 'nombre', label: 'Nombre', sortable: true, width: '15%',
          },
          {
            key: 'foto', label: 'Foto', width: '10%',
          },
          {
            key: 'presentacion', label: 'Presentación', width: '15%',
          },
          {
            key: 'clasificaciones', label: 'Clasificaciones', width: '22%',
          },
          {
            key: 'es_controlado', label: 'Es Controlado', sortable: true, width: '12%',
          },
          {
            key: 'empresa', label: 'Empresa', sortable: true, width: '15%',
          },
        ];
      } else {
        this.fields = [
          {
            key: 'editar', label: '', width: '3%',
          },
          {
            key: 'eliminar', label: '', width: '3%',
          },
          {
            key: 'id', label: 'Id', sortable: true, width: '5%',
          },
          {
            key: 'nombre', label: 'Nombre', sortable: true, width: '17%',
          },
          {
            key: 'codigo_barra', label: 'Codigo de Barra', width: '12%',
          },
          {
            key: 'foto', label: 'Foto', width: '10%',
          },
          {
            key: 'empresa', label: 'Empresa', sortable: true, width: '15%',
          },
          {
            key: 'stock_minimo', label: 'Stock mínimo', width: '11%',
          },
          {
            key: 'descripcion', label: 'Descripción', width: '24%',
          },
        ];
      }
      this.getProductosApi();
    },
    openModalEliminar(id) {
      this.selectedId = id;
      this.modalEliminar = true;
    },
    async deleteItem() {
      this.modalEliminar = false;
      if (this.selectedId === null) {
        return;
      }
      try {
        this.items = this.items.filter((el) => el.id !== this.selectedId);
        const response = await deleteProduct(this.selectedId);
        this.selectedId = null;
        if (response.status === StatusCodes.deleted) {
          showNotify('Registro Eliminado', 'Se elimino el registro correctamente.', TypeNotification.Ok);
        } else {
          showNotify('No se pudo eliminar el registro', response.data.message, TypeNotification.Error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.getProductosApi();
      }
    },
    async getProductosApi() {
      this.isLoadingTable = true;
      const params = {
        type: this.selectedRadio,
        filter: this.search,
        page: this.currentPage,
        state: this.filterState,
      };
      try {
        const response = await getProducts(params);
        this.items = response.data.productos.data;
        this.totalRows = response.data.productos.total;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoadingTable = false;
      }
    },
    async generarPDF() {
      if (this.isLoadingPDF) {
        return;
      }
      this.isLoadingPDF = true;
      try {
        const response = await getProductsPdf();
        openPdfNewTab(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoadingPDF = false;
      }
    },
  },
  computed: {
    getPagesPagination(){
      return Math.ceil(this.totalRows/this.perPage);
    },
  },
  watch: {
    selectedRadio(newVal,oldVal) {
      this.onChangeTipoVista();      
    },
    currentPage(newVal,oldVal) {
      this.getProductosApi();
    },
  },
};
</script>
<template>
  <div>
    <div class="row mb-3">
      <div class="flex md12 pt-0">
        <h4 class="display-5">Lista de Productos</h4>
      </div>
    </div>
    <va-card>
      <div class="row">
        <div class="row flex md9">
          <div class="flex md2" style="text-align: center">
            <va-button
              color="info"
              class="mr-2"
              @click="goToCreateRoute"
            >
              Nuevo
            </va-button>
          </div>
          <div class="flex md6">
            <va-button-group color="secondary" outline class="mr-2">
              <va-button
                @click="modalClasificacion = !modalClasificacion"
              >
                Clasificación
              </va-button>
              <va-button> Presentacion </va-button>
              <va-button> Lote </va-button>
            </va-button-group>
          </div>
          <div class="flex md1 pl-0">
            <img
              @click="generarPDF"
              title="lista de productos"
              height="36"
              src="@/assets/pdf_icon.svg"
              :style="isLoadingPDF? 'cursor:wait':'cursor:pointer'"
            >
          </div>
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
        <div class="flex md6 text-center pt-1">
          <va-radio
            v-for="(option, index) in optionsRadio"
            :key="index"
            v-model="selectedRadio"
            :option="option.value"
            :label="option.text"
            name="radio-options"
          />
        </div>
      </div>
      <div class="row mx-0 table-responsive">
        <va-data-table
          no-data-html="No hay datos"
          striped
          :items="items"
          :columns="fields"
          :loading="isLoadingTable"
        >
          <template #cell(editar)="{ rowData }">
            <router-link
              v-if="filterState"
              :to="{ name: 'producto-edit', params: { id: encodeBase64(rowData.id) } }"
            >
              <va-icon name="edit" color="secondary"/>
            </router-link>
          </template>
          <template #cell(eliminar)="{ rowData }">
            <va-icon
              v-if="filterState"
              @click="openModalEliminar(rowData.id)"
              name="delete_outline"
              color="danger"
              style="cursor:pointer"
            />
          </template>
          <template #cell(foto)="{ rowData }">    
            <img
              v-if="rowData.foto !== null"
              :src="rowData.foto"
              :alt="rowData.foto"
              width="48"
            >          
          </template>
          <template #cell(es_controlado)="{ rowData }">
            {{rowData.es_estupefaciente || rowData.es_psicotropico? 'Si': 'No'}}
          </template>
        </va-data-table>
      </div>
      <div class="row mt-3">
        <div class="flex offset--md8 md4">
          <va-pagination
            v-model="currentPage"
            :pages="getPagesPagination"
            :visible-pages="3"
            direction-links
          />
        </div>
      </div>
      <va-modal
        v-model="modalEliminar"
        size="small"
        title="Eliminar Registro"

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
      <ModalClasificacion v-model="modalClasificacion" @onUpdate="getProductosApi"/>
    </va-card>
  </div>
</template>