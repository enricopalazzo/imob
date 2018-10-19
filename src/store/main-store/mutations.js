export const updateCurrentUser = (state, object) => {
  console.log('llegamos' + object.id)
  state.currentUser.id = object.id
  state.currentUser.rol = object.rol
}

export const increment = (state) => {
  console.log('incrementa' + state)
  state.count++
}
