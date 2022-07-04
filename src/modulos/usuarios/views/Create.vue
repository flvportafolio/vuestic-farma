<script>
import showNotify, { TypeNotification } from '@/utils/notifications';
import moment from 'moment';
import { createUser, getCreateReferences } from "@/services/userApi";
import { useMainStore } from '@/stores/index';
import InterfaceLoader from '@/components/InterfaceLoader.vue';

export default {
  name: 'Create',
  components: {
    InterfaceLoader,
  },
  created() {
    useMainStore().setNavigationTitle('Crear nuevo usuario');
    this.getReferences();
  },
  data() {
    return {
      interfaceIsReady: false,
      isDisabledSaveButton: false,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      numeroCarnet: '',
      direccion: '',
      correo: '',
      nombreUsuario: '',
      password: '',
      fechaNacimiento: null,
      sexoSelected: null,
      listaGeneros: [
        { id: 'M', nombre: 'Hombre' },
        { id: 'F', nombre: 'Mujer' },
      ],
      cargoSelected: null,
      listaCargos: [],
      rolSelected: null,
      listaRoles: [],
      paisTelefonoSelected: null,
      listaPaises: [],
    };
  },
  methods: {
    goToIndex() {
      if (this.$route.name !== 'usuario-index') {
        this.$router.push({ name: 'usuario-index' });
      }
    },
    async saveForm() {
      this.isDisabledSaveButton = true;
      let fechaNacValidada = null;
      if (this.fechaNacimiento !== null) {
        fechaNacValidada = moment(this.fechaNacimiento).format('YYYY/MM/DD');
      }
      const payload = {
        nombre: this.nombre,
        apellido_paterno: this.apellidoPaterno,
        apellido_materno: this.apellidoMaterno,
        numero_carnet: this.numeroCarnet,
        direccion: this.direccion,
        fecha_nacimiento: fechaNacValidada,
        sexo: this.sexoSelected?.id ?? null,
        pais_id_telefono: this.paisTelefonoSelected?.id ?? null,
        telefono: this.telefono,
        cargo_id: this.cargoSelected?.id ?? null,
        role_id: this.rolSelected?.id ?? null,
        nombre_usuario: this.nombreUsuario,
        correo: this.correo,
        password: this.password,
      };
      try {
        const response = await createUser(payload);
        showNotify('Registro exitoso!', response.data.message, TypeNotification.Ok);
        this.$router.push({ name: 'usuario-index' });
      } catch (error) {
        Object.entries(error.response.data.validations).forEach(([, value]) => {
          value.forEach((el) => {
            showNotify('Error de validación', el, TypeNotification.Warn);
          });
        });
        this.isDisabledSaveButton = false;
      }
    },
    async getReferences() {
      try {
        const response = await getCreateReferences();
        this.listaPaises = response.data.paises;
        this.listaCargos = response.data.cargos;
        this.listaRoles = response.data.roles;
        this.interfaceIsReady = true;
      } catch (error) {
        console.log(error);
      }
    },
    disableFutureDates(date) {
      return date > new Date(new Date().setHours(0, 0, 0, 0));
    },
  },
  computed: {
    getPrefijoLlamada() {
      if (this.paisTelefonoSelected === null) {
        return '';
      }
      return `+${this.paisTelefonoSelected.prefijo_llamada}`;
    },
  },
};
</script>

<template>
  <va-card>
    <div class="row mx-0 px-2">
      <div class="flex md9">
        <va-button
          tabindex="16"
          color="secondary"
          class="mr-2"
          @click="goToIndex"
        >
          Atrás
        </va-button>
        <va-button
          tabindex="15"
          color="success"
          class="mr-2"
          :disabled="isDisabledSaveButton"
          @click="saveForm"
        >
          Guardar
        </va-button>
      </div>
    </div>
    <va-divider class="mt-0"></va-divider>
    <div v-if="interfaceIsReady" class="pl-4 py-4">
      <div class="row">
        <div class="flex md2 pr-0 text-right">
          Nombre(s): <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <va-input
            v-model="nombre"
            :tabindex="1"
          />
          <!-- <va-input
            class="mb-4"
            v-model="nombre"
            :tabindex="1"
            label="Nombre(s):"
            required-mark
          /> -->
        </div>
        <div class="flex md2 pr-0 text-right">
          Fecha de nacimiento: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <date-picker
            :input-attr="{ tabindex: 8 }"
            class="flex md12 py-0 px-0"
            v-model:value="fechaNacimiento"
            :disabled-date="disableFutureDates"
            format="DD/MM/YYYY"
            type="date"
            placeholder="Seleccionar Fecha"
          ></date-picker>
        </div>
        <div class="flex md1 pr-0 text-right">
          Sexo: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <multiselect
            :tabindex="13"
            label="nombre"
            track-by="id"
            v-model="sexoSelected"
            :options="listaGeneros"
            :searchable="false"
            placeholder="Seleccionar"
            selectLabel=""
            selectedLabel=""
            deselectLabel="X"
          >
          </multiselect>
        </div>
      </div>
      <div class="row">
        <div class="flex md2 pr-0 text-right">
          Apellido paterno: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <va-input
            v-model="apellidoPaterno"
            :tabindex="2"
          />
        </div>
        <div class="flex md2 text-right">
          Cargo: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <multiselect
            :tabindex="9"
            label="nombre"
            track-by="id"
            v-model="cargoSelected"
            :options="listaCargos"
            placeholder="Seleccionar"
            selectLabel=""
            selectedLabel=""
            deselectLabel="X"
          >
            <template #noResult>
              No se encontraron elementos para esa busqueda.
            </template>
            <template #noOptions>No hay cargos registrados</template>
          </multiselect>
        </div>
        <div class="flex md1 pr-0 text-right">
          Rol: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <multiselect
            :tabindex="14"
            label="nombre"
            track-by="id"
            v-model="rolSelected"
            :options="listaRoles"
            placeholder="Seleccionar"
            selectLabel=""
            selectedLabel=""
            deselectLabel="X"
          >
            <template #noResult>
              No se encontraron elementos para esa busqueda.
            </template>
            <template #noOptions>No hay roles registrados</template>
          </multiselect>
        </div>
      </div>
      <div class="row">
        <div class="flex md2 pr-0 text-right">
          Apellido materno: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <va-input
            v-model="apellidoMaterno"
            :tabindex="3"
          />
        </div>
        <div class="flex md2 pr-0 text-right">
          Telefono: <span class="text-danger">*</span>
        </div>
        <div class="flex md3">
          <div class="row">
            <div class="flex md4 pr-2">
              <multiselect
                :tabindex="10"
                label="nombre"
                track-by="id"
                v-model="paisTelefonoSelected"
                :options="listaPaises"
                :searchable="false"
                placeholder=""
                selectLabel=""
                selectedLabel=""
                deselectLabel="X"
              >
                <template #noOptions>No hay paises registrados</template>
                <template #singleLabel="props">
                  <img class="option__image" :src="props.option.imagen" width="32">
                </template>
                <template #option="props">
                  <img class="option__image" :src="props.option.imagen" width="32">
                </template>
              </multiselect>
            </div>
            <div class="flex md8 pl-0">
              <va-input
                v-model="telefono"
                placeholder="numero celular"
                :tabindex="11"
              >
                <template #prependInner>
                  {{getPrefijoLlamada}}
                </template>
              </va-input>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-5">
        <div class="flex md2 pr-0 text-right">
          Numero de carnet: <span class="text-danger">*</span>
        </div>
        <div class="flex md2">
          <va-input
            v-model="numeroCarnet"
            :tabindex="4"
          />
        </div>
        <div class="flex md2 pr-0 text-right">
          Dirección: <span class="text-danger">*</span>
        </div>
        <div class="flex md3">
          <va-input
            v-model="direccion"
            :tabindex="12"
          />
        </div>
      </div>


      <div class="row">
        <div class="flex md2 text-right">
          <label class="font-weight-bold">
            Correo: <span class="text-danger">*</span>
          </label>
        </div>
        <div class="flex md2">
          <va-input
            name="email"
            v-model="correo"
            :tabindex="5"
            type="email"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md2 text-right">
          <label class="font-weight-bold">
            Nombre de usuario: <span class="text-danger">*</span>
          </label>
        </div>
        <div class="flex md2">
          <va-input
            v-model="nombreUsuario"
            :tabindex="6"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md2 text-right">
          <label class="font-weight-bold">
            Contraseña: <span class="text-danger">*</span>
          </label>
        </div>
        <div class="flex md2">
          <va-input
            name="password"
            v-model="password"
            :tabindex="7"
            type="password"
          />
        </div>
      </div>
    </div>
    <InterfaceLoader v-else/>
  </va-card>
</template>