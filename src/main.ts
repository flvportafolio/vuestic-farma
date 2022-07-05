import { createApp } from 'vue';
import App from './App.vue';
import { createVuestic } from 'vuestic-ui';
import 'vuestic-ui/dist/vuestic-ui.css';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import 'vue-datepicker-next/locale/es';
import CurrencyInput from "./components/CurrencyInput.vue";

import Notifications from '@kyvg/vue3-notification';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createVuestic());
app.use(createPinia());
app.use(router);
app.component('multiselect', Multiselect);
app.use(DatePicker);
app.component('CurrencyInput', CurrencyInput);
app.use(Notifications);
app.mount('#app');