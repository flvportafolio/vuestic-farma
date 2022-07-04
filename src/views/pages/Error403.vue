<template>
  <div class="row mt-5">
    <div class="flex offset--md4 md4 text-center">
      <h1 class="title-403">403</h1>
    </div>
    <div class="flex md12 error-content mt-5">
      <h2>No tienes privilegios para acceder a esa página.</h2>
      <va-button to="/" color="info" class="mt-3">Volver al Inicio</va-button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Error403',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Nunito+Sans');

.title-403 {
  font-size: 6rem;
  font-weight: 300;
  line-height: 1.2;
}
.error-content {
  font-family:"Nunito Sans";
  text-align: center;
}
</style>
