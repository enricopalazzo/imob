<template>
  <q-page padding>
    <div v-if="loading">{{respuesta}}</div>
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
// import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
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
        },
        {
          name: 'Editar',
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
  methods: {
    rowClick (val) {
      console.log('clickiti' + val)
    },
    getUsers: function () {
      var headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      axios.get('https://my.api.mockaroo.com/users.json?key=429a6dc0', headers)
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
    }
  },
  beforeMount () {
    this.getUsers()
  }
  /* validations: {
    email: { required, email }
  } */
}
</script>

<style>
</style>
