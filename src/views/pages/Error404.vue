<template>  
  <div class="row pt-5">
    <div class="flex offset--md4 md4">
      <img src="img/404-not-found.svg" class="w-100">
    </div>
    <div class="flex md12 error-content mt-5">
      <h2 class="display-5">Página no encontrada</h2>
      <va-button to="/" color="info" class="mt-3">Volver al Inicio</va-button>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'Error404',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Nunito+Sans');
.error-content {
  font-family:"Nunito Sans";
  text-align: center;
}
.w-100 {
  width: 100%!important;
}
</style>
