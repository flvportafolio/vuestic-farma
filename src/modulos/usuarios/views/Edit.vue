<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import moment from 'moment';
import { getUser, updateUser } from "@/services/userApi";
import showNotify, { TypeNotification } from '@/utils/notifications';
import InterfaceLoader from '@/components/InterfaceLoader.vue';

const router = useRouter();
const route = useRoute();

const id = ref(decodeBase64(route.params.id));
const interfaceIsReady = ref(false);
const isDisabledUpdateButton = ref(false);
const nombre = ref('');
const apellidoPaterno = ref('');
const apellidoMaterno = ref('');
const telefono = ref('');
const numeroCarnet = ref('');
const direccion = ref('');
const correo = ref('');
const nombreUsuario = ref('');
const password = ref('');
const fechaNacimiento = ref<any>(null);
const sexoSelected = ref<any>(null);
const listaGeneros = [
  { id: 'M', nombre: 'Hombre' },
  { id: 'F', nombre: 'Mujer' },
];
const cargoSelected = ref<any>(null);
const listaCargos = ref<any[]>([]);
const rolSelected = ref<any>(null);
const listaRoles = ref<any[]>([]);
const paisTelefonoSelected = ref<any>(null);
const listaPaises = ref<any[]>([]);

function decodeBase64(data: any) {
  try {
    return window.atob(data);
  } catch (error) {
    showNotify('Error con la URL', 'Verifique que la URL sea la correcta', TypeNotification.Error);
    return null;
  }
}
function goToIndex() {
  if (route.name !== 'usuario-index') {
    router.push({ name: 'usuario-index' });
  }
}
async function updateForm() {
  isDisabledUpdateButton.value = true;
  if (id.value === null) {
    return;
  }
  let fechaNacValidada = null;
  if (fechaNacimiento.value !== null) {
    fechaNacValidada = moment(fechaNacimiento.value).format('YYYY/MM/DD');
  }
  const payload = {
    nombre: nombre.value,
    apellido_paterno: apellidoPaterno.value,
    apellido_materno: apellidoMaterno.value,
    numero_carnet: numeroCarnet.value,
    direccion: direccion.value,
    fecha_nacimiento: fechaNacValidada,
    sexo: sexoSelected.value?.id ?? null,
    pais_id_telefono: paisTelefonoSelected.value?.id ?? null,
    telefono: telefono.value,
    cargo_id: cargoSelected.value?.id ?? null,
    role_id: rolSelected.value?.id ?? null,
    nombre_usuario: nombreUsuario.value,
    correo: correo.value,
    password: password.value,
  };
  try {
    const response = await updateUser(id.value, payload);
    showNotify('Se modifico el registro', response.data.message, TypeNotification.Ok);
    goToIndex();
  } catch (error: any) {
    Object.entries(error.response.data.validations).forEach(([, value]) => {
      const tempList = value as Array<string>;
      tempList.forEach((el: string) => {
        showNotify('Error de validación', el, TypeNotification.Warn);
      });
    });
    isDisabledUpdateButton.value = false;
  }
}
async function getReferences() {
  if (id.value === null) {
    return;
  }
  try {
    const response = await getUser(id.value);
    listaPaises.value = response.data.paises;
    listaCargos.value = response.data.cargos;
    listaRoles.value = response.data.roles;

    nombre.value = response.data.usuario.nombre;
    apellidoPaterno.value = response.data.usuario.apellido_paterno;
    apellidoMaterno.value = response.data.usuario.apellido_materno;
    numeroCarnet.value = response.data.usuario.numero_carnet;
    fechaNacimiento.value = moment(response.data.usuario.fecha_nacimiento, 'YYYY-MM-DD').toDate();
    cargoSelected.value = listaCargos.value.find((el) => (
      el.id === response.data.usuario.cargo_id
    ));
    rolSelected.value  = listaRoles.value.find((el) => (
      el.id === response.data.usuario.role_id
    ));
    paisTelefonoSelected.value = listaPaises.value.find((el) => (
      el.id === response.data.usuario.pais_id_telefono
    ));
    telefono.value = response.data.usuario.telefono;
    direccion.value = response.data.usuario.direccion;
    sexoSelected.value = listaGeneros.find((el) => (
      el.id === response.data.usuario.sexo
    ));
    correo.value = response.data.usuario.correo;
    nombreUsuario.value = response.data.usuario.nombre_usuario;

    interfaceIsReady.value = true;
  } catch (error) {
    console.log(error);
  }
}

function disableFutureDates(date: any) {
  return date > new Date(new Date().setHours(0, 0, 0, 0));
}

const getPrefijoLlamada = computed(() => {
  if (paisTelefonoSelected.value === null) {
    return '';
  }
  return `+${paisTelefonoSelected.value.prefijo_llamada}`;
});

onMounted(()=> {
  getReferences();
});
</script>
<template>
  <div>
    <div class="row mb-3">
      <div class="flex md12 pt-0">
        <h4 class="display-5">Modificar usuario Id: {{id}}</h4>
      </div>
    </div>
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
            :disabled="isDisabledUpdateButton"
            @click="updateForm"
          >
            Modificar
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
  </div>
</template>