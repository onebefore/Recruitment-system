import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    role: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setRole(state, role) {
      state.role = role;
    },
  },
  actions: {},
  modules: {},
});