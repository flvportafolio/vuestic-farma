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
  <div class="row">
    <div class="offset-md-3 col-md-6">
      <div class="row my-3">
        <div class="col-md-12 text-center">
          <h4>Mi Perfil</h4>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-group">
                <label>Nombre</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
              <div class="form-group">
                <label>Apellido Paterno</label>
                <input
                  v-model="apellidoPaterno"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
              <div class="form-group">
                <label>Apellido Materno</label>
                <input
                  v-model="apellidoMaterno"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
              <div class="form-group">
                <label>Correo</label>
                <input
                  v-model="correo"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>Numero de Carnet</label>
                <input
                  v-model="numeroCarnet"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
              <div class="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  v-model="fechaNacimiento"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
              <div class="form-group">
                <label>Cargo</label>
                <input
                  v-model="cargo"
                  type="text"
                  class="form-control"
                  readonly
                >
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <fieldset class="border p-2">
                <legend class="w-auto px-2 h5">Cambiar contraseña</legend>
                <div class="row mx-0">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Contraseña Actual</label>
                      <div class="input-group">
                        <input
                          v-model="currentPassword"
                          :type="isVisibleCurrentPassword ? 'text': 'password'"
                          class="form-control"
                        >
                        <div class="input-group-append">
                          <span class="input-group-text">
                            <svg
                              v-if="isVisibleCurrentPassword"
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              role="button"
                              fill="currentColor"
                              style="font-size: 125%;"
                              class="bi bi-eye"
                              viewBox="0 0 16 16"
                              @click="isVisibleCurrentPassword = !isVisibleCurrentPassword"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                            </svg>
                            <svg
                              v-else
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              role="button"
                              fill="currentColor"
                              style="font-size: 125%;"
                              class="bi bi-eye-slash"
                              viewBox="0 0 16 16"
                              @click="isVisibleCurrentPassword = !isVisibleCurrentPassword"
                            >
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Nueva Contraseña</label>
                      <div class="input-group">
                        <input
                          v-model="newPassword"
                          :type="isVisibleNewPassword ? 'text': 'password'"
                          class="form-control"
                        >
                        <div class="input-group-append">
                          <span class="input-group-text">
                            <svg
                              v-if="isVisibleNewPassword"
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              role="button"
                              fill="currentColor"
                              style="font-size: 125%;"
                              class="bi bi-eye"
                              viewBox="0 0 16 16"
                              @click="isVisibleNewPassword = !isVisibleNewPassword"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                            </svg>
                            <svg
                              v-else
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              role="button"
                              fill="currentColor"
                              style="font-size: 125%;"
                              class="bi bi-eye-slash"
                              viewBox="0 0 16 16"
                              @click="isVisibleNewPassword = !isVisibleNewPassword"
                            >
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <button
                      class="btn btn-primary btn-block"
                      @click="updateKeys"
                    >Actualizar</button>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
