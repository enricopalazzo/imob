<template>
  <q-page padding>
    <div v-if="loading">{{respuesta}}</div>
    <q-btn
      icon-right="add"
      color="teal"
      label="Agregar Nuevo Usuario"
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
          <h3>Agregar Usuario</h3>
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
          <q-btn
            color="light"
            v-close-overlay
            label="Cancelar"
            class="float-right  on-right"
          />
          <q-btn
            @click="addUser()"
            color="positive"
            label="Agregar"
             class="float-right"
          />
        </div>
      </q-modal-layout>
    </q-modal>
    <q-table
    title="Usuarios"
    :data="users"
    :columns="columns"
    row-key="name"
    >
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row)" class="cursor-pointer">
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
import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: ''
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
          classes: 'my-class',
          style: 'width: 200px'
        },
        {
          name: 'last_name',
          required: true,
          label: 'Apellido',
          align: 'left',
          field: 'last_name',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
        },
        {
          name: 'email',
          required: true,
          label: 'email',
          align: 'left',
          field: 'email',
          sortable: true,
          classes: 'my-class',
          style: 'width: 200px'
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
      first_name: { required }
    }
  },
  methods: {
    rowClick (val) {
      console.log('clickiti' + val)
    },
    toggleModal () {
      this.opened = !this.opened
    },
    getUsers: function () {
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get('http://localhost:3000/users', headers)
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
    addUser: function () {
      console.log(this.$v.form.$error)
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var headers = {
          'Content-Type': 'application/json'
        }
        let objeto = {
          'first_name': this.form.first_name,
          'last_name': this.form.last_name,
          'email': this.form.email
        }
        console.log(objeto)
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
    resetForm () {
      this.form.first_name = ''
      this.form.last_name = ''
      this.form.email = ''
    }
  },
  beforeMount () {
    this.getUsers()
  }
}
</script>

<style>
</style>
