<template>
  <q-page padding>
    <div v-if="loading"></div>
    <q-btn
      icon-right="add"
      color="teal"
      label="Agregar Urbanización"
      @click="toggleModal"
      size="lg"
      rounded
      class="form-row"
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
          <h3>{{form.actionName}} Urbanización</h3>
          <div class="row gutter-md form-row">
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field
                :error="$v.form.nombre.$error"
                error-label="Este campo es obligatorio"
              >
                <q-input v-model="form.nombre" float-label="Nombre *" placeholder="Agregar nombre de urbanización, edificio, conjunto, etc..."  />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field
                :error="$v.form.direccion.$error"
                error-label="Este campo es obligatorio"
              >
                <q-input v-model="form.direccion"
                type="textarea"
                :max-height="100"
                float-label="Dirección *"
                placeholder="Agregar dirección..."  />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field
                :error="$v.form.telefono.$error"
                error-label="Este campo es obligatorio"
              >
                <q-input v-model="form.telefono" float-label="Teléfono" placeholder="Agregar el número de teléfono..."  />
              </q-field>
            </div>
          </div>
          <div class="row gutter-md form-row">
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-select
                float-label="Seleccione usuario"
                v-model="form.usuarios"
                :options="selectOptions"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-uploader ref="uploader" float-label="Subir imagen" :url="uploadurl" />
            </div>
          </div>
          <q-btn
            color="light"
            v-close-overlay
            label="Cancelar"
            class="float-right  on-right"
          />
          <q-btn
            @click="putUrbanizaciones()"
            color="positive"
            :label="form.actionName"
             class="float-right"
          />
        </div>
      </q-modal-layout>
    </q-modal>
    <div v-if="loading"></div>
    <q-table
    title="Urbaizaciones"
    :data="urbanizaciones"
    :columns="columns"
    row-key="id"
    >
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row.key)" class="cursor-pointer">
         <q-td key="name" :props="props">{{ props.row.name }}</q-td>
         <q-td key="address" :props="props">{{ props.row.address }}</q-td>
         <q-td key="phone" :props="props">{{ props.row.phone }}</q-td>
         <q-td key="urlImage" :props="props">{{ props.row.urlImage }}</q-td>
         <q-td key="idUser" :props="props">mapUserId({{ props.row.idUser }})</q-td>
        <q-td key="col-actions" :props="props"><q-btn @click='open_edit_modal(props.row)'><q-icon name="edit" /></q-btn></q-td>
      </q-tr>
    </q-table>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-page>
</template>

<script>
import axios from 'axios'
// import _ from 'lodash'
// import uuidv5 from 'uuid/v5'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      currentUserId: 3,
      uploadurl: '',
      form: {
        nombre: '',
        telefono: '',
        direccion: '',
        usuarios: '',
        imagen: '',
        actionName: 'Agregar'
      },
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
          classes: 'my-class'
        },
        {
          name: 'address',
          required: true,
          label: 'Dirección',
          align: 'left',
          field: 'address',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'phone',
          required: true,
          label: 'Teléfono',
          align: 'left',
          field: 'phone',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'urlImage',
          required: true,
          label: 'urlImage',
          align: 'left',
          field: 'urlImage',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'idUser',
          required: true,
          label: 'Id Usuario',
          align: 'left',
          field: 'idUser',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'col-actions',
          required: true,
          label: 'Acciones',
          align: 'left',
          classes: 'my-class'
        }
      ],
      urbanizaciones: [],
      users: [], // mover a esto a vuex state
      loading: false,
      respuesta: 'waiting'
    }
  },
  methods: {
    open_edit_modal (data) {
      this.opened = true
      this.form.usuarios = data.idUser
      this.form.nombre = data.name
      this.form.direccion = data.address
      this.form.telefono = data.phone
      this.form.urlImage = data.urlImage
      console.log(data)
      this.form.actionName = 'Editar'
    },
    getUsers () {
      axios.get('http://localhost:3000/users?_page=1&_limit=20')
        .then((response) => {
          this.users = response.data
          this.users.forEach(element => {
            let objeto = {
              'label': element.first_name + ' ' + element.last_name,
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
      this.resetForm()
      this.opened = !this.opened
    },
    rowClick (val) {
      console.log('clickiti' + val)
    },
    getUrbanizaciones: function () {
      var getUrl = 'http://localhost:3000/urbanizaciones'
      if (this.currentUserId !== 0) {
        getUrl += '?idUser=' + this.currentUserId
      }
      // axios.get('http://localhost:3000/urbanizaciones?idUser=' + this.currentUserId, headers)
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          console.log(response)
          this.urbanizaciones = response.data
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
            this.respuesta = error
          }
        })
    },
    putUrbanizaciones: function () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var headers = {
          'Content-Type': 'application/json'
        }
        let user = ''
        /* let urbId = uuidv5('imobation.com', uuidv5.DNS)
        console.log(urbId) */
        if (!this.form.usuarios) {
          user = 0
        } else {
          user = this.form.usuarios
        }
        // make object
        let objeto = {
          'idUser': user,
          'name': this.form.nombre,
          'address': this.form.direccion,
          'phone': this.form.telefono,
          'urlImage': 'http://dummyimage.com/110x182.jpg/5fa2dd/ffffff'
        }
        console.log(objeto)
        this.loading = true
        axios.post('http://localhost:3000/urbanizaciones', objeto, headers)
          .then((response) => {
            this.loading = false
            console.log(response)
            this.getUrbanizaciones()
            this.resetForm()
            this.opened = false
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
      this.uploadurl = ''
      this.form.nombre = ''
      this.form.telefono = ''
      this.form.direccion = ''
      this.form.usuarios = ''
      this.form.imagen = ''
    }
  },

  beforeMount () {
    /* esto debería del vuex state */
    this.getUrbanizaciones()
    this.getUsers()
    // this.createSelectOptions()
  },
  validations: {
    form: {
      nombre: { required },
      telefono: { required },
      direccion: { required }
    }
  }
}
</script>

<style>
</style>
