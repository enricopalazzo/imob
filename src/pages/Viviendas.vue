<template>
  <q-page padding>
    <q-select
      float-label="Selecciona una urbanización"
      v-model="currentUrbanizacion"
      :options="selectOptions"
      @input="getViviendas"
    />
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
          <q-btn @click='open_edit_modal(props.row)' size="sm"><q-icon name="edit" /></q-btn>
          <q-btn @click='delete_vivienda(props.row)' size="sm"><q-icon name="delete" /></q-btn>
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
      urbanizaciones: [],
      selectOptions: [],
      form: {
        name: '',
        idUrbanizacion: '',
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
      idUrbanizacion: { required }
    }
  },
  methods: {
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
    getUrbanizaciones: function () {
      var getUrl = 'http://localhost:3000/urbanizaciones'
      if (this.currentUser !== 0) {
        getUrl += '?idUser=' + this.currentUser
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
    }
  },
  beforeMount () {
    this.getViviendas()
    this.getUrbanizaciones()
  }
}
</script>

<style>
</style>
