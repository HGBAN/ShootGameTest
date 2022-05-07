<template>
  <div>
    <SideBar :nav="nav" @expand-changed="onExpandChanged"></SideBar>
    <table class="table-layout">
      <tr>
        <td class="left" :class="{'left-expand':sideBarExpand}">

        </td>
        <td class="container">
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
  }
});
</script>

<style scoped>
.table-layout{
  border-collapse: collapse;
  border-spacing: 0;
}

.left {
  width: 55px;
  transition: width 0.5s;
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