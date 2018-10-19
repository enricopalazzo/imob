import axios from 'axios'

export function getViviendas (state) {
  var getUrl = 'http://localhost:3000/getViviendas'
  var headers = {
    'Content-Type': 'application/json'
  }
  axios.get(getUrl, headers)
    .then((response) => {
      this.loading = false
      console.log('hola' + response)
      state = response.data
    }, (error) => {
      if (error) {
        console.log(error)
      }
    })
}
