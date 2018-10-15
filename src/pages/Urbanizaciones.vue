<template>
  <q-page padding>
    <q-btn
      icon-right="add"
      color="teal"
      label="Agregar Urbanización"
      @click="toggleModal"
      size="lg"
      rounded
    />
    <q-modal v-model="opened" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            dense
            v-close-overlay
            icon="keyboard_arrow_left"
            label="Volver"
          />
        </q-toolbar>
        <div class="layout-padding">
          <h3>Agregar Urbanización</h3>
          <div class="row gutter-md">
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="text" float-label="Nombre" placeholder="Agregar nombre de urbanización, edificio, conjunto, etc..."  />
              </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="area"
                type="textarea"
                :max-height="100"
                float-label="Dirección"
                placeholder="Agregar dirección..."  />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="text" float-label="Teléfono" placeholder="Agregar el número de teléfono..."  />
            </div>
          </div>
          <div class="row gutter-md">
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-select
                float-label="Seleccione usuario"
                v-model="select"
                :options="selectOptions"
              />
            </div>
          </div>
          <q-btn
            color="light"
            v-close-overlay
            label="Cancelar"
          />
          <q-btn
            color="positive"
            v-close-overlay
            label="Agregar"
          />
        </div>
      </q-modal-layout>
    </q-modal>
    <div v-if="loading">{{respuesta}}</div>
    <q-table
    title="Urbaizaciones"
    :data="urbanizaciones"
    :columns="columns"
    row-key="id"
    >
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row.key)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </q-table>
     <q-inner-loading :visible="loading">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-page>
</template>

<script>
import axios from 'axios'
// import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      selectOptions: [],
      opened: false,
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: 'name',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
        },
        {
          name: 'address',
          required: true,
          label: 'Dirección',
          align: 'left',
          field: 'address',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
        },
        {
          name: 'phone',
          required: true,
          label: 'Teléfono',
          align: 'left',
          field: 'phone',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
        },
        {
          name: 'urlImage',
          required: true,
          label: 'urlImage',
          align: 'left',
          field: 'urlImage',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
        }
      ],
      urbanizaciones: [],
      users: [], // mover a esto a vuex state
      loading: false,
      respuesta: 'waiting'
    }
  },
  methods: {
    createSelectOptions () {
      axios.get('https://my.api.mockaroo.com/urbanizaciones.json?key=429a6dc0')
        .then((response) => {
          console.log(response)
          this.users = response.data
          this.users.forEach(element => {
            console.log('element' + element)
            let objeto = {
              'label': element.name,
              'value': element.id
            }
            this.selectOptions.push(objeto)
          })
        }, (error) => {
          if (error) {
            console.log(error)
          }
        })
    },
    toggleModal () {
      this.opened = !this.opened
    },
    rowClick (val) {
      console.log('clickiti' + val)
    },
    getUrbanizaciones: function () {
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get('https://my.api.mockaroo.com/urbanizaciones.json?key=429a6dc0', headers)
        .then((response) => {
          this.loading = false
          console.log(response)
          this.urbanizaciones = response.data
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = true
            this.respuesta = error
          }
        })
    }
  },
  beforeMount () {
    this.getUrbanizaciones()
    this.createSelectOptions()
  }
  /* validations: {
    email: { required, email }
  } */
}
</script>

<style>
</style>
