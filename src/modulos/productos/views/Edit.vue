<script>
import showNotify, { TypeNotification } from '@/utils/notifications';

export default {
  name: 'Edit',
  data() {
    return {
      id: this.decodeBase64(this.$route.params.id),
    };
  },
  methods: {
    decodeBase64(data) {
      try {
        return window.atob(data);
      } catch (error) {
        showNotify('Error con la URL', 'Verifique que la URL sea la correcta', TypeNotification.Error);
        return null;
      }
    },
  },
};
</script>
<template>
  <div>
    <h4>Modificar producto Id: {{id}}</h4>
    <hr>
  </div>
</template>