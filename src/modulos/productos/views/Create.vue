<script>
import { createProduct, getCreateReferences } from "@/services/productApi";
import showNotify, { TypeNotification } from '@/utils/notifications';
import InterfaceLoader from '@/components/InterfaceLoader.vue';
import InputWrapper from '@/components/InputWrapper.vue';

export default {
  name: 'Create',
  components: {
    InterfaceLoader,
    InputWrapper,
  },
  created() {
    this.getReferences();
  },
  data() {
    return {
      interfaceIsReady: false,
      isDisabledSaveButton: false,
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
  methods: {
    goToIndex() {
      if (this.$route.name !== 'producto-index') {
        this.$router.push({ name: 'producto-index' });
      }
    },
    clearFieldsMedicamento() {
      if (this.esMedicamento === false) {
        this.temperatura = 0;
        this.selectedRadio = false;
        this.registroSanitario = '';
        this.presentacionSelected = null;
        this.clasificacionesSelected = [];
      }
    },
    async saveForm() {
      this.isDisabledSaveButton = true;

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
        const response = await createProduct(payload);
        showNotify('Registro exitoso!', response.data.message, TypeNotification.Ok);
        this.goToIndex();
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
        this.listaEmpresas = response.data.empresas;
        this.listaPresentaciones = response.data.presentaciones;
        this.listaClasificaciones = response.data.clasificaciones;
        this.interfaceIsReady = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<template>
  <div>
    <div class="row mb-3">
      <div class="flex md12 pt-0">
        <h4 class="display-5">Crear nuevo producto</h4>
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
            :disabled="isDisabledSaveButton"
            @click="saveForm"
          >
            Guardar
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
          <div class="flex offset--md1 md6">
            <fieldset class="border px-2 py-2" :disabled="!esMedicamento">
              <legend class="px-2">
                <input
                  v-model="esMedicamento"
                  @change="clearFieldsMedicamento"
                  type="checkbox"
                  id="es_medicamento"
                >
                <label class="display-6" for="es_medicamento">
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