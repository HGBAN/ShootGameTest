import {createStore} from 'vuex'
import {User} from "@/model";

export default createStore({
    state: {
        user: null as null | User
    },
    mutations: {
      setUser(state, user) {
        state.user = user;
      }
    },
    actions: {},
    modules: {}
})
