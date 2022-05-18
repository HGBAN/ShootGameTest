// vuex.d.ts
import {ComponentCustomProperties} from 'vue'
import {Store} from 'vuex'
import {User} from "@/model";

declare module '@vue/runtime-core' {
    // 声明自己的 store state
    interface State {
        user: User;
    }

    // 为 `this.$store` 提供类型声明
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
