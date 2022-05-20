import {createStore} from 'vuex'
import {User} from "@/model";

export default createStore({
    state: {
        user: null as null | User,
        loadingNum: 0
    },
    mutations: {
        setUser(state, user: User) {
            state.user = user;
        },
        setLoading(state, add: boolean) {
            if (add)
                state.loadingNum++;
            else
                state.loadingNum--;
        }
    },
    actions: {},
    modules: {}
})
