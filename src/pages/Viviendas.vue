<template>
  <q-page padding>
    <q-btn
      icon-right="add"
      color="teal"
      label="Agregar Vivienda"
      @click="toggleModal"
      size="lg"
      rounded
      class="form-row"
    />
    <h5>Tus viviendas</h5>
      <div class="row gutter-md form-row">
        <div class="col-xs-12 col-sm-6 col-md-5">
          <q-select
            float-label="Selecciona una urbanización para ver las viviendas asociadas"
            v-model="currentUrbanizacion"
            :options="selectOptions"
            @input="getViviendas"
          />
        </div>
      </div>
    <br>
    <q-table
    :title="tableTitle"
    :data="viviendas"
    :columns="columns"
    row-key="name"
    >
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="idUrbanizacion" :props="props">{{ props.row.idUrbanizacion }}</q-td>
        <q-td key="col-actions" :props="props">
          <q-btn @click='editVivienda(props.row)' size="sm"><q-icon name="edit" /></q-btn>
          <q-btn @click='deleteVivienda(props.row.id)' size="sm"><q-icon name="delete" /></q-btn>
        </q-td>
      </q-tr>
    </q-table>
    <q-modal v-model="opened" :content-css="{minWidth: '60vw', minHeight: '80vh'}">
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
          <h3>{{form.actionName}} Vivienda</h3>
          <div class="row gutter-md form-row">
            <div class="col-xs-12 col-sm-6 col-md-12">
              <q-field
                :error="$v.form.name.$error"
                error-label="Este campo es obligatorio"
              >
                <q-input v-model="form.name" float-label="Nombre *" placeholder="Agregar nombre de vivienda, apartamento, etc..."  />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
               <q-select
                  float-label="Selecciona una urbanización"
                  v-model="form.idUrbanizacion"
                  :options="selectOptions"
                />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
               <q-select
                  float-label="Tipo de vivienda"
                  v-model="form.type"
                  :options="selectTypeOptions"
                />
            </div>
          </div>
          <q-btn
            color="light"
            v-close-overlay
            label="Cancelar"
            class="float-right  on-right"
          />
          <q-btn
            @click="addVivienda()"
            color="positive"
            :label="form.actionName"
             class="float-right"
          />
        </div>
      </q-modal-layout>
    </q-modal>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-page>
</template>

<script>
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'
export default {
  computed: {
    currentUser: {
      get () {
        return this.$store.state.mainstore.currentUser
      }
    }
  },
  data () {
    return {
      tableTitle: 'Viviendas',
      // currentUserId: this.currentUser,
      currentUrbanizacion: null,
      viviendas: [],
      tipoVivienda: [],
      urbanizaciones: [],
      selectOptions: [],
      selectTypeOptions: [],
      form: {
        name: '',
        idUrbanizacion: '',
        type: [],
        actionName: 'Agregar'
      },
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
          name: 'idUrbanizacion',
          required: true,
          label: 'Urbanización',
          align: 'left',
          field: 'idUrbanizacion',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
        },
        {
          name: 'col-actions',
          required: true,
          label: 'Acciones',
          align: 'left',
          classes: 'my-class'
        }
      ],
      loading: false
    }
  },
  validations: {
    form: {
      name: { required },
      idUrbanizacion: { required },
      type: { required }
    }
  },
  methods: {
    toggleModal () {
      this.resetForm()
      this.opened = !this.opened
    },
    editVivienda (data) {
      this.opened = true
      this.form.idUrbanizacion = data.idUrbanizacion
      this.form.name = data.name
      this.form.type = data.type
      this.form.actionName = 'Editar'
    },
    deleteVivienda (id) {
      var getUrl = 'http://localhost:3000/getViviendas'
      if (id !== null) {
        getUrl += '/' + id
        var headers = {
          'Content-Type': 'application/json'
        }
        this.loading = true
        axios.delete(getUrl, headers)
          .then((response) => {
            this.loading = false
            alert('vivienda eliminada')
            this.getViviendas()
          }, (error) => {
            if (error) {
              console.log(error)
              this.loading = false
            }
          })
      }
    },
    getViviendas: function () {
      if (this.currentUrbanizacion !== null) {
        var getUrl = 'http://localhost:3000/getViviendas'
        this.tableTitle = 'No has seleccionado una urbanización'
        if (this.currentUrbanizacion !== null) {
          getUrl += '?idUrbanizacion=' + this.currentUrbanizacion
          this.tableTitle = 'Viviendas de esta urbanización'
        }
        var headers = {
          'Content-Type': 'application/json'
        }
        this.loading = true
        axios.get(getUrl, headers)
          .then((response) => {
            this.loading = false
            console.log('hola' + response)
            this.viviendas = response.data
          }, (error) => {
            if (error) {
              console.log(error)
              this.loading = false
              this.respuesta = error
            }
          })
      }
    },
    getTipoVivienda: function () {
      var getUrl = 'http://localhost:3000/tipoVivienda'
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          this.tipoVivienda = response.data
          this.tipoVivienda.forEach(element => {
            let objeto = {
              'label': element.name,
              'value': element.id
            }
            this.selectTypeOptions.push(objeto)
          })
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
            this.respuesta = error
          }
        })
    },
    getUrbanizaciones: function () {
      var getUrl = 'http://localhost:3000/urbanizaciones'
      if (this.currentUser.rol === 2) {
        getUrl += '?idUser=' + this.currentUser.id
      }
      // axios.get('http://localhost:3000/urbanizaciones?idUser=' + this.currentUserId, headers)
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get(getUrl, headers)
        .then((response) => {
          this.urbanizaciones = response.data
          this.loading = false
          this.urbanizaciones.forEach(element => {
            let objeto = {
              'label': element.name,
              'value': element.id
            }
            console.log('dfd')
            this.selectOptions.push(objeto)
          })
          console.log(response)
          this.urbanizaciones = response.data
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
          }
        })
    },
    addVivienda: function () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var headers = {
          'Content-Type': 'application/json'
        }
        // make object
        let objeto = {
          'idUrbanizacion': this.form.idUrbanizacion,
          'name': this.form.name,
          'type': this.form.type
        }
        console.log(objeto)
        this.loading = true
        axios.post('http://localhost:3000/getViviendas', objeto, headers)
          .then((response) => {
            this.loading = false
            this.resetForm()
            this.opened = false
            this.getViviendas()
          }, (error) => {
            if (error) {
              console.log(error)
              this.loading = false
              this.respuesta = error
            }
          })
      }
    },
    resetForm () {
      this.form.name = ''
      this.form.idUrbanizacion = ''
      this.form.type = ''
      this.form.actionName = 'Agregar'
    }
  },
  beforeMount () {
    this.getViviendas()
    this.getUrbanizaciones()
    this.getTipoVivienda()
  }
}
</script>

<style>
</style>
