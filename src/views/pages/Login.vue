<script setup lang="ts">
import { ref } from 'vue';
import showNotify, { TypeNotification } from '@/utils/notifications';
import $axios from '@/axiosConfig';
import { StatusCodes } from '@/utils/statusCodes';


const correo = ref('');
const pass = ref('');
const correocustomClassEmail = ref('');
const customClassPassword = ref('');
const loading = ref(false);

function addclassEffectEmail() {
  correocustomClassEmail.value = 'focus';
}

function addclassEffectPass() {
  customClassPassword.value = 'focus';
}

function removeclassEffectEmail() {
  if (correo.value === '') {
    correocustomClassEmail.value = '';
  }
}

function removeclassEffectPass() {
  if (pass.value === '') {
    customClassPassword.value = '';
  }
}
async function login() {
  const payload = {
    correo: correo.value,
    password: pass.value,
  };
  try {
    loading.value = true;
    const response = await $axios.post('login', payload);
    localStorage.setItem('token', response.data.access_token);
    window.location.reload();
  } catch (error: any) {
    loading.value = false;
    localStorage.removeItem('token');
    if (error.response.status === StatusCodes.unAuthorized) {
      showNotify('Login Incorrecto', error.response.data.message, TypeNotification.Warn);
      return;
    }
    Object.entries(error.response.data.validations).reverse().forEach(([, value]) => {
      const tempList = value as Array<string>;
      tempList.forEach((el: string) => {
        showNotify('Error de validación', el, TypeNotification.Warn);
      });
    });
  }
}
</script>

<template>
  <div>
    <img class="wave" src="@/assets/wave.webp">
    <div class="container">
      <div class="img">
        <img src="@/assets/bg.webp" width="500" height="500">
      </div>
      <div class="login-content">
        <form @submit.prevent="login">
          <img src="@/assets/avatar.svg" width="100" height="100">
          <h3 class="display-3 py-4">Login</h3>
          <div class="input-div one" :class="correocustomClassEmail">
            <div class="i">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
            </div>
            <div class="div">
              <h5>Correo</h5>
              <input
                v-model="correo"
                type="text"
                class="input"
                @focus="addclassEffectEmail"
                @blur="removeclassEffectEmail"
              >
            </div>
          </div>
          <div class="input-div pass" :class="customClassPassword">
            <div class="i">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-lock-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"/>
              </svg>
            </div>
            <div class="div">
              <h5>Contraseña</h5>
              <input
                v-model="pass"
                type="password"
                class="input"
                @focus="addclassEffectPass"
                @blur="removeclassEffectPass"
              >
            </div>
          </div>
          <button type="submit" class="btn mt-5">            
            Iniciar sesión
          </button>
          <div style="height: 8px;">
            <va-progress-bar indeterminate v-if="loading"/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wave{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: -1;
}

.container{
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap :7rem;
  padding: 0 2rem;
}

.img{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.login-content{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

.img img{
  width: 500px;
}

form{
  width: 360px;
}

.login-content img{
  height: 100px;
  margin-top: -70px
}

.login-content h2{
  margin: 15px 0;
  color: #333;
  text-transform: uppercase;
  font-size: 2.9rem;
}

.login-content .input-div{
  position: relative;
  display: grid;
  grid-template-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one{
  margin-top: 0;
}

.i{
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.i i{
  transition: .3s;
}

.input-div > div{
  position: relative;
  height: 45px;
}

.input-div > div > h5{
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
  transition: .3s;
}

.input-div:before, .input-div:after{
  content: '';
  position: absolute;
  bottom: -2px;
  width: 0%;
  height: 2px;
  background-color: #38d39f;
  transition: .4s;
}

.input-div:before{
  right: 50%;
}

.input-div:after{
  left: 50%;
}

.input-div.focus:before, .input-div.focus:after{
  width: 50%;
}

.input-div.focus > div > h5{
  top: -5px;
  font-size: 15px;
}

.input-div.focus > .i{
  color: #38d39f;
}

.input-div > div > input{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: #555;
  font-family: 'poppins', sans-serif;
}

.input-div.pass{
  margin-bottom: 4px;
}

a{
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: .3s;
}

a:hover{
  color: #38d39f;
}

.btn{
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  margin: 1rem 0;
  cursor: pointer;
  transition: .5s;
}
.btn:hover{
  background-position: right;
}

@media screen and (max-width: 1050px){
  .container{
    grid-gap: 5rem;
  }
}

@media screen and (max-width: 1000px){
  form{
    width: 290px;
  }

  .login-content h2{
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img img{
    width: 400px;
  }
}

@media screen and (max-width: 900px){
  .container{
    grid-template-columns: 1fr;
  }

  .img{
    display: none;
  }

  .wave{
    display: none;
  }

  .login-content{
    justify-content: center;
  }
}
</style>
