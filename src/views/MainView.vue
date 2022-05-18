<template>
  <div>
    <SideBar :nav="nav" @expand-changed="onExpandChanged"></SideBar>
    <table class="table-layout">
      <tr>
        <td class="left" :class="{'left-expand':sideBarExpand}">

        </td>
        <td style="padding: 0" class="container">
          <router-view/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts" setup>
import SideBar from "@/components/SideBar/SideBar.vue";
</script>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Nav} from "@/components/SideBar/SideBar.vue";
import axios from "axios";
export default defineComponent({
  name: "MainView",

  data() {
    return {
      sideBarExpand: true
    };
  },

  methods: {
    onExpandChanged(expand: boolean) {
      this.sideBarExpand = expand;
    }
  },

  props:{
    nav: {
      type: Array as PropType<Nav[]>,
      required: true
    }
  },

  created() {
    axios({
      url: "/user/userInfo",
    })
        .then((res) => {
          if (res.data.errCode != 101) {
            // this.config.user = res.data.data;
            this.$store.commit("setUser", res.data.data);
            // this.nickname = res.data.data.nickname;
            // console.log(this.$route.path);
          } else {
            // console.log(this.$route.path);
            if (this.$route.path != "/login")
              this.$router.push("/login?path=" + this.$route.path);
          }
        })
        .catch(() => {
          if (this.$route.path != "/login")
            this.$router.push("/login?path=" + this.$route.path);
        });
  },
});
</script>

<style scoped>
.table-layout{
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.left {
  width: 55px;
  transition: width 0.5s;
  padding: 0;
}

.left-expand {
  width: 300px;
}

@media screen and (max-width: 768px) {
  .left {
    width: 0;
  }

  .left-expand {
    width: 0;
  }
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>