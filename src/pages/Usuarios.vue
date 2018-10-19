<template>
  <q-page padding>
    <div v-if="loading">{{respuesta}}</div>
    <q-btn
      icon-right="add"
      color="teal"
      :label="form.actionName + ' ' +  rolTitle"
      @click="toggleModal"
      size="lg"
      rounded
      class="form-row"
    />
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
          <h3>{{form.actionName}} {{rolTitle}}</h3>
          <div class="row gutter-md form-row">
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field
                :error="$v.form.first_name.$error"
                error-label="Este campo es obligatorio"
              >
                <q-input v-model="form.first_name" float-label="Nombre" placeholder="Agregar nombre de usuario..."  />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field
                :error="$v.form.last_name.$error"
                error-label="Este campo es obligatorio"
              >
                <q-input v-model="form.last_name" float-label="Apellido" placeholder="Agregar apellido..."  />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field
                :error="$v.form.email.$error"
                error-label="Please type a valid email"
              >
                <q-input
                  v-model="form.email"
                  type="email"
                  float-label="Email"
                  placeholder="Agregar el email del usuario..."
                  :error="$v.form.email.$error"/>
              </q-field>
            </div>
          </div>
          <div class="row gutter-md form-row">
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-select v-if="currentUser.rol===1"
                  float-label="Selecciona tipo de Administrador"
                  v-model="form.rol"
                  :options="rolOptions"
                  :error="$v.form.email.$error"
                />
              <q-select v-if="currentUser.rol===2"
                  float-label="Selecciona la urbanización"
                  v-model="currentUserUrbs"
                  :options="urbOptions"
                  :error="$v.form.email.$error"
                  @input="urbChanged"
                />
                <input v-if="currentUser.rol===2" type="hidden"  v-model="form.rol">
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select v-if="viviOptions.length>1"
                  float-label="Selecciona la vivienda"
                  v-model="currentVivienda"
                  :options="viviOptions"
                  @input="viviChanged"
                  :error="$v.form.email.$error"
                />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select v-if="areaOptions"
                  multiple
                  float-label="Selecciona las areas de acceso"
                  v-model="currentAreas"
                  :options="areaOptions"
                  :error="$v.form.email.$error"
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
            @click="addUser()"
            color="positive"
            :label="form.actionName"
            class="float-right"
          />
        </div>
      </q-modal-layout>
    </q-modal>
    <q-table
    :title="rolTitle + 's'"
    :data="users"
    :columns="columns"
    row-key="name"
    >
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
        <q-td key="first_name" :props="props">{{ props.row.first_name }}</q-td>
        <q-td key="last_name" :props="props">{{ props.row.last_name }}</q-td>
        <q-td key="email" :props="props">{{ props.row.email }}</q-td>
        <q-td key="rol" :props="props">{{ props.row.rol }}</q-td>
        <q-td key="col-actions" :props="props">
          <q-btn @click='open_edit_modal(props.row)' size="sm"><q-icon name="edit" /></q-btn>
          <q-btn @click='open_urbanizacion(props.row.id)' class="on-right" size="sm" label="Ver urbanizaciones"> <q-icon name="expand_more" class="on-right" />
           <q-popover>
            <q-list>
              <q-item v-close-overlay v-for="urbanizacion in currentUserUrbs" :key="urbanizacion.id">
                 {{urbanizacion.name}}
              </q-item>
            </q-list>
          </q-popover>
          </q-btn>
          <q-btn v-if="currentUser.rol===2" @click='open_areas(props.row.id)' class="on-right" size="sm" label="Ver Areas"> <q-icon name="expand_more" class="on-right" />
           <q-popover>
            <q-list>
              <q-item v-close-overlay v-for="urbanizacion in currentUserUrbs" :key="urbanizacion.id">
                 {{urbanizacion.name}}
              </q-item>
            </q-list>
          </q-popover>
          </q-btn>
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
import { required, email } from 'vuelidate/lib/validators'
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
      rolTitle: 'Administrador',
      currentUserUrbs: [],
      currentVivienda: '',
      urbOptions: [],
      viviOptions: [],
      areaOptions: [],
      currentAreas: [],
      rolOptions: [
        {
          'value': 1,
          'label': 'SuperAdmin'
        },
        {
          'value': 2,
          'label': 'Administrador'
        }
      ],
      form: {
        first_name: '',
        last_name: '',
        email: '',
        actionName: 'Agregar',
        rol: '3'
      },
      opened: false,
      columns: [
        {
          name: 'first_name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: 'first_name',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'last_name',
          required: true,
          label: 'Apellido',
          align: 'left',
          field: 'last_name',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'email',
          required: true,
          label: 'email',
          align: 'left',
          field: 'email',
          sortable: true,
          classes: 'my-class'
        },
        {
          name: 'rol',
          required: true,
          label: 'Rol',
          align: 'left',
          field: 'rol',
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
      users: [],
      loading: false,
      respuesta: 'waiting'
    }
  },
  validations: {
    form: {
      email: { required, email },
      last_name: { required },
      first_name: { required },
      rol: { required }
    }
  },
  methods: {
    open_edit_modal (data) {
      this.opened = true
      this.form.email = data.email
      this.form.first_name = data.first_name
      this.form.last_name = data.last_name
      this.form.rol = data.rol
      this.form.actionName = 'Editar'
    },
    open_urbanizacion (userId) {
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      var getUrl = 'http://localhost:3000/urbanizaciones?idUser=' + userId
      console.log(getUrl)
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          this.currentUserUrbs = response.data
          console.log(this.currentUserUrbs.length)
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
          }
        })
    },
    open_areas (userId) {
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      var getUrl = 'http://localhost:3000/areas?idUser=' + userId
      console.log(getUrl)
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          this.currentUserUrbs = response.data
          console.log(this.currentUserUrbs.length)
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
          }
        })
    },
    toggleModal () {
      this.resetForm()
      this.opened = !this.opened
    },
    getUsers: function () {
      console.log('buscando usuarios' + this.currentUser.rol)
      var getUrl = 'http://localhost:3000/users'
      /* if (this.currentUser.rol === 2) { // si es Admins solo mostrar sus usuarios
        getUrl += '?rol=3'
      } */
      var headers = {
        'Content-Type': 'application/json'
      }
      switch (this.currentUser.rol) {
        case 2: // es Admin, solo mostrar sus usuarios. ROl 3 y que sean usuarios de alguna de sus urbanizaciones
          getUrl += '?rol=3'
          break
        case 1:
          getUrl += '?rol=2&rol=1'
          break
          /* default:
              code block */
      }
      this.loading = true
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          console.log(response)
          this.users = response.data
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = true
            this.respuesta = error
          }
        })
    },
    getUrbanizaciones () {
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
          this.loading = false
          var estasurbanizaciones = response.data
          estasurbanizaciones.forEach(element => {
            let objeto = {
              'label': element.name,
              'value': element.id
            }
            this.urbOptions.push(objeto)
            this.getViviendas()
          })
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
          }
        })
    },
    urbChanged () {
      this.getViviendas()
    },
    viviChanged () {
      this.getAreas()
    },
    getViviendas: function () {
      var getUrl = 'http://localhost:3000/getViviendas'
      if (this.currentUserUrbs) {
        getUrl += '?idUrbanizacion=' + this.currentUserUrbs
      }
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          var estasviviendas = response.data
          estasviviendas.forEach(element => {
            let objeto = {
              'label': element.name,
              'value': element.id
            }
            this.viviOptions.push(objeto)
          })
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
            this.respuesta = error
          }
        })
    },
    addUser () {
      console.log(' Error ' + this.$v.form.$error)
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var headers = {
          'Content-Type': 'application/json'
        }
        let objeto = {
          'first_name': this.form.first_name,
          'last_name': this.form.last_name,
          'email': this.form.email,
          'rol': this.form.rol
        }
        console.log('usuario ' + objeto)
        this.loading = true
        axios.post('http://localhost:3000/users', objeto, headers)
          .then((response) => {
            this.loading = false
            console.log(response)
            this.getUsers()
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
    getAreas: function () {
      var getUrl = 'http://localhost:3000/areas'
      this.tableTitle = 'No has seleccionado una urbanización'
      if (this.currentUserUrbs !== null) {
        getUrl += '?idUrbanizacion=' + this.currentUserUrbs
      }
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      console.log(getUrl)
      axios.get(getUrl, headers)
        .then((response) => {
          this.loading = false
          var estasviviendas = response.data
          estasviviendas.forEach(element => {
            let objeto = {
              'label': element.name,
              'value': element.id
            }
            this.areaOptions.push(objeto)
          })
        }, (error) => {
          if (error) {
            console.log(error)
            this.loading = false
            this.respuesta = error
          }
        })
    },
    resetForm () {
      this.form.first_name = ''
      this.form.last_name = ''
      this.form.email = ''
      this.form.rol = ''
      if (this.currentUser.rol === 2) {
        this.form.rol = 3
      }
    }
  },
  beforeMount () {
    this.getUsers()
    this.getUrbanizaciones()
    if (this.currentUser.rol === 2) {
      this.rolTitle = 'Usuario'
    }
  }
}
</script>

<style>
</style>
