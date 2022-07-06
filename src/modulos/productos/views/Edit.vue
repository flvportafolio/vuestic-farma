<script>
import { getProduct, updateProduct } from "@/services/productApi";
import showNotify, { TypeNotification } from '@/utils/notifications';
import InterfaceLoader from '@/components/InterfaceLoader.vue';
import InputWrapper from '@/components/InputWrapper.vue';

export default {
  name: 'Edit',
  components: {
    InterfaceLoader,
    InputWrapper,
  },
  data() {
    return {
      id: this.decodeBase64(this.$route.params.id),
      interfaceIsReady: false,
      isDisabledUpdateButton: false,
      nombre: '',
      codigo_barra: '',
      stockMinimo: 1,
      empresaSelected: null,
      listaEmpresas: [],
      foto: '',
      descripcion: '',

      esMedicamento: false,
      temperatura: 30,
      selectedRadio: false,
      optionsRadio: [
        { text: 'Estupefaciente', value: 'E' },
        { text: 'Psicotropico', value: 'P' },
        { text: 'No', value: false },
      ],
      registroSanitario: '',
      presentacionSelected: null,
      listaPresentaciones: [],
      clasificacionesSelected: [],
      listaClasificaciones: [],
      //extras
      isFocusedInputStockMinimo: false,
      isFocusedInputTemperatura: false,
    };
  },
  created() {
    this.getData();
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
    goToIndex() {
      if (this.$route.name !== 'producto-index') {
        this.$router.push({ name: 'producto-index' });
      }
    },
    async getData() {
      if (this.id === null) {
        return;
      }
      try {
        const response = await getProduct(this.id);
        this.listaEmpresas = response.data.empresas;
        this.listaPresentaciones = response.data.presentaciones;
        this.listaClasificaciones = response.data.clasificaciones;

        this.nombre = response.data.producto.nombre;
        this.codigo_barra = response.data.producto.codigo_barra;
        this.stockMinimo = response.data.producto.stock_minimo;
        this.empresaSelected = this.listaEmpresas.find((el) => (
          el.id === response.data.producto.empresa_id
        ));
        this.foto = response.data.producto.foto;
        this.descripcion = response.data.producto.descripcion;
        if (response.data.medicamento !== null) {
          let tipoControlado = false;
          if (response.data.medicamento.es_estupefaciente) {
            tipoControlado = 'E';
          }
          if (response.data.medicamento.es_psicotropico) {
            tipoControlado = 'P';
          }
          this.esMedicamento = true;
          this.temperatura = parseInt(response.data.medicamento.temperatura_conservacion ?? 0);
          this.selectedRadio = tipoControlado;
          this.registroSanitario = response.data.medicamento.registro_sanitario;
          this.presentacionSelected = this.listaPresentaciones.find((el) => (
            el.id === response.data.medicamento.presentacion_id
          ));
          this.clasificacionesSelected = response.data.medicamento.clasificacion_medicamento;
        }
        this.interfaceIsReady = true;
      } catch (error) {
        console.log(error);
      }
    },
    async updateForm() {
      this.isDisabledUpdateButton = true;
      if (this.id === null) {
        return;
      }
      const payload = {
        es_medicamento: this.esMedicamento,
        nombre: this.nombre,
        codigo_barra: this.codigo_barra,
        stock_minimo: this.stockMinimo,
        empresa_id: this.empresaSelected?.id ?? null,
        foto: this.foto,
        descripcion: this.descripcion,

        temperatura_conservacion: this.temperatura,
        es_estupefaciente: this.selectedRadio === 'E',
        es_psicotropico: this.selectedRadio === 'P',
        registro_sanitario: this.registroSanitario,
        presentacion_id: this.presentacionSelected?.id ?? null,
        clasificaciones: this.clasificacionesSelected,
      };
      try {
        const response = await updateProduct(this.id, payload);
        showNotify('Se modifico el registro', response.data.message, TypeNotification.Ok);
        this.goToIndex();
      } catch (error) {
        Object.entries(error.response.data.validations).forEach(([, value]) => {
          value.forEach((el) => {
            showNotify('Error de validación', el, TypeNotification.Warn);
          });
        });
        this.isDisabledUpdateButton = false;
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="row mb-3">
      <div class="flex md12 pt-0">
        <h4 class="display-5">Modificar producto Id: {{id}}</h4>
      </div>
    </div>
    <va-card>
      <div class="row mx-0 px-2">
        <div class="flex md9">
          <va-button
            color="secondary"
            class="mr-2"
            @click="goToIndex"
          >
            Atrás
          </va-button>
          <va-button
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
      <div class="row mx-0 py-4" v-if="interfaceIsReady">
        <div class="row mx-0">
          <div class="flex md5">
            <div class="row mb-3">
              <div class="flex md4 text-right pr-0">
                Nombre: <span class="text-danger">*</span>
              </div>
              <div class="flex md8">
                <va-input
                  v-model="nombre"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="flex md4 text-right pr-0">
                Código de Barra:
              </div>
              <div class="flex md8">
                <va-input
                  v-model="codigo_barra"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="flex md4 text-right pr-0">
                Stock Mínimo: <span class="text-danger">*</span>
              </div>
              <div class="flex md8">
                <InputWrapper :is-focused="isFocusedInputStockMinimo">
                  <CurrencyInput
                    class="text-center"
                    v-model="stockMinimo"
                    currencyDisplay="hidden"
                    :options="{
                      currency: 'USD',
                      currencyDisplay: 'hidden',
                      precision: 0,
                      autoSign: false,
                    }"
                    @focus="isFocusedInputStockMinimo = true" @blur="isFocusedInputStockMinimo = false"
                  />
                </InputWrapper>
              </div>
            </div>
            <div class="row mb-3">
              <div class="flex md4 text-right pr-0">              
                Empresa Fabricante: <span class="text-danger">*</span>
              </div>
              <div class="flex md8">
                <multiselect
                  label="nombre"
                  track-by="id"
                  v-model="empresaSelected"
                  :options="listaEmpresas"
                  placeholder="Seleccionar"
                  selectLabel=""
                  selectedLabel=""
                  deselectLabel="X"
                >
                  <template #noResult>
                    No se encontraron elementos para esa busqueda.
                  </template>
                  <template #noOptions>No hay empresas registradas</template>
                </multiselect>
              </div>
            </div>
            <div class="row mb-3">
              <div class="flex md4 text-right pr-0">
                URL Foto:
              </div>
              <div class="flex md8">
                <va-input
                  v-model="foto"
                />
              </div>
            </div>
            <div class="row">
              <div class="flex md4 text-right pr-0">
                Descripción:
              </div>
              <div class="flex md8">
                <va-input
                  v-model="descripcion"
                  type="textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>
          <div class="flex offset--md1 md6" v-if="esMedicamento">
            <fieldset class="border px-2 py-2">
              <legend class="px-2">
                <label class="display-6">
                  Medicamento
                </label>            
              </legend>
              <div class="row mb-3">
                <div class="flex md5 text-right pr-0">                
                  Temperatura de Conservación:          
                </div>
                <div class="flex md4">
                  <InputWrapper :is-focused="isFocusedInputTemperatura">
                    <CurrencyInput
                      class="form-control text-center"
                      v-model="temperatura"
                      currencyDisplay="hidden"
                      :options="{
                        currency: 'USD',
                        currencyDisplay: 'hidden',
                        precision: 0,
                        valueRange: {
                          min: -20,
                          max: 40
                        }
                      }"
                      @focus="isFocusedInputTemperatura = true" @blur="isFocusedInputTemperatura = false"
                    />
                    <template #appendInner>
                      °C
                    </template>
                  </InputWrapper>
                </div>
              </div>
              <div class="row mb-3">
                <div class="flex md5 text-right pr-0">
                  Es controlado: <span class="text-danger">*</span>
                </div>
                <div class="flex md7 text-center">
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
              <div class="row mb-3">
                <div class="flex md5 text-right pr-0">
                  Registro sanitario: <span class="text-danger">*</span>
                </div>
                <div class="flex md7">
                  <va-input
                    v-model="registroSanitario"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="flex md5 text-right pr-0">
                  Presentación: <span class="text-danger">*</span>
                </div>
                <div class="flex md7">
                  <multiselect
                    label="nombre"
                    track-by="id"
                    v-model="presentacionSelected"
                    :options="listaPresentaciones"
                    placeholder="Seleccionar"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel="X"
                  >
                    <template #noResult>
                      No se encontraron elementos para esa busqueda.
                    </template>
                    <template #noOptions>No hay presentaciones registradas</template>
                  </multiselect>
                </div>
              </div>
              <div class="row mb-3">
                <div class="flex md12">
                  Clasificaciones para el medicamento <span class="text-danger">*</span>
                </div>
                <div class="flex md12 pt-0">                  
                  <multiselect
                    v-model="clasificacionesSelected"
                    :options="listaClasificaciones"
                    :multiple="true"
                    track-by="id"
                    label="nombre"
                    placeholder="Seleccionar"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel="X"
                  >
                    <template #noResult>
                      No se encontraron elementos para esa busqueda.
                    </template>
                    <template #noOptions>No hay clasificaciones registradas</template>
                  </multiselect>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <InterfaceLoader v-else/>
    </va-card>
  </div>
</template>