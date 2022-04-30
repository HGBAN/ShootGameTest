<template>
  <div class="sidebar-item">
    <div v-for="(item,index) in nav" :key="index">
      <div class="sidebar-label-container" @click="onItemClick(index)">
        <div :style="{left:(20+level*20)+'px'}" class="sidebar-label">
          {{ item.label }}
          <span :class="{'sidebar-arrow-reverse':expand[index]}" class="sidebar-arrow" v-if="item.children">∧</span>
        </div>
      </div>
      <TreeItem :ref="'item'+index" v-if="item.children"
                :style="{height:expand[index]?item.children.length*40+'px':'0'}"
                :class="{'sidebar-item-show':expand[index],'sidebar-item-hide-show':!outerExpand}" :nav="item.children"
                :level="level+1" :outer-expand="outerExpand"></TreeItem>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Nav} from "@/components/SideBar/SideBar.vue";

export default defineComponent({
  name: "TreeItem",

  data() {
    return {
      expand: [] as boolean[]
    };
  },

  methods: {
    onItemClick(index: number) {
      if (!this.nav)
        return;
      if (!this.nav[index].children)
        return;
      if (this.expand[index]) {
        this.expand[index] = false;
        (this.$refs['item' + index] as any)[0].hideAll();
      } else
        this.expand[index] = true;
    },

    hideAll() {
      if (!this.nav)
        return;
      for (let i = 0; i < this.nav.length; i++) {
        if (!this.nav[i].children)
          continue;
        // console.log(i);
        this.expand[i] = false;
        // console.log(this.$refs['item' + i]);
        (this.$refs['item' + i] as any)[0].hideAll();
      }
    }
  },

  props: {
    nav: {
      type: Array as PropType<Nav[]>
    },
    level: {
      type: Number as PropType<number>,
      default: 0
    },
    outerExpand:{
      type:Boolean as PropType<boolean>,
      required:true
    }
  }
});
</script>

<style>

</style>