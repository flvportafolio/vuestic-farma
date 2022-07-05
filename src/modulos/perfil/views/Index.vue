<script setup lang="ts">
import moment from 'moment';
import { ref } from 'vue';
import $axios from '@/axiosConfig';
import showNotify, { TypeNotification } from '@/utils/notifications';

const id = ref<string | null>(null);
const nombre = ref('');
const apellidoPaterno = ref('');
const apellidoMaterno = ref('');
const correo = ref('');
const numeroCarnet = ref('');
const fechaNacimiento = ref('');
const cargo = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const isVisibleCurrentPassword = ref(false);
const isVisibleNewPassword = ref(false);


async function getInfoApi() {
  try {
    const response = await $axios.post('me');
    id.value = response.data.usuario.usuario_id;
    nombre.value = response.data.usuario.nombre;
    apellidoPaterno.value = response.data.usuario.apellido_paterno;
    apellidoMaterno.value = response.data.usuario.apellido_materno;
    correo.value = response.data.usuario.correo;
    numeroCarnet.value = response.data.usuario.numero_carnet;
    fechaNacimiento.value = moment(response.data.usuario.fecha_nacimiento).format('DD/MM/YYYY');
    cargo.value = response.data.usuario.cargo;
  } catch (error) {
    console.log(error);
  }
}

async function updateKeys() {
  if (id.value === null) {
    return;
  }
  const payload = {
    actual: currentPassword.value,
    nuevo: newPassword.value,
  };
  try {
    const response = await $axios.post(`usuarios/${id.value}/update-password`, payload);
    showNotify('Modificación de Credenciales', response.data.message, TypeNotification.Ok);
    currentPassword.value = '';
    newPassword.value = '';
  } catch (error: any) {
    Object.entries(error.response.data.validations).forEach(([, value]) => {
      const tempList = value as Array<string>;
      tempList.forEach((el: string) => {
        showNotify('Error de validación', el, TypeNotification.Warn);
      });
    });
  }
}
//created hook of vue2
getInfoApi();

</script>

<template>
  <div class="row mb-5">
    <div class="flex offset--md3 md6">
      <div class="row mb-3">
        <div class="flex md12 text-center">
          <h4 class="display-5">Mi Perfil</h4>
        </div>
      </div>
      <va-card class="mb-4 px-3 pt-3">
        <div class="row mb-3">
          <div class="flex md6">
            <va-input
              class="mb-4"
              v-model="nombre"
              readonly
              label="Nombre"
            />
            <va-input
              class="mb-4"
              v-model="apellidoPaterno"
              readonly
              label="Apellido Paterno"
            />
            <va-input
              class="mb-4"
              v-model="apellidoMaterno"
              readonly
              label="Apellido Materno"
            />
            <va-input
              class="mb-4"
              v-model="correo"
              readonly
              label="Correo"
            />
          </div>
          <div class="flex md6">
            <va-input
              class="mb-4"
              v-model="numeroCarnet"
              readonly
              label="Numero de Carnet"
            />
            <va-input
              class="mb-4"
              v-model="fechaNacimiento"
              readonly
              label="Fecha de Nacimiento"
            />
            <va-input
              class="mb-4"
              v-model="cargo"
              readonly
              label="Cargo"
            />
          </div>
        </div>
        <div class="row">
          <div class="flex md12">
            <fieldset class="border px-2 py-2">
              <legend class="px-2 display-6">Cambiar contraseña</legend>
              <div class="row mx-0">
                <div class="flex md6">
                  <va-input
                    v-model="currentPassword"
                    :type="isVisibleCurrentPassword ? 'text': 'password'"
                    label="Contraseña Actual"
                  >
                    <template #appendInner>
                      <va-icon
                        v-if="isVisibleCurrentPassword"
                        style="cursor:pointer;"
                        name="visibility"
                        @click="isVisibleCurrentPassword = !isVisibleCurrentPassword"
                      />
                      <va-icon
                        v-else
                        style="cursor:pointer;"
                        name="visibility_off"
                        @click="isVisibleCurrentPassword = !isVisibleCurrentPassword"
                      />
                    </template>
                  </va-input>
                </div>
                <div class="flex md6">
                  <va-input
                    v-model="newPassword"
                    :type="isVisibleNewPassword ? 'text': 'password'"
                    label="Nueva Contraseña"
                  >
                    <template #appendInner>
                      <va-icon
                        v-if="isVisibleNewPassword"
                        style="cursor:pointer;"
                        name="visibility"
                        @click="isVisibleNewPassword = !isVisibleNewPassword"
                      />
                      <va-icon
                        v-else
                        style="cursor:pointer;"
                        name="visibility_off"
                        @click="isVisibleNewPassword = !isVisibleNewPassword"
                      />
                    </template>
                  </va-input>
                </div>
                <div class="flex md12">
                  <va-button
                    style="width: 100%;"
                    color="info"
                    @click="updateKeys"
                  >
                    Actualizar
                  </va-button>
                </div>
              </div>
            </fieldset>
          </div>
        </div>        
      </va-card>
    </div>
  </div>
</template>
