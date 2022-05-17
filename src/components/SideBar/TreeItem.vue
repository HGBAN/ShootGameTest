<template>
  <div class="sidebar-item">
    <div v-for="(item,index) in nav" :key="index">
      <div style="white-space:nowrap" class="sidebar-label-container" @click="onItemClick(index)"
           :class="{'sidebar-label-container-active':$route.path===item.link||(childrenActive[index]&&!expand[index])}">
        <div :style="{left:(15+level*20)+'px'}" class="sidebar-icon-container">
          <svg-icon v-if="item.icon" :icon-name="item.icon" class-name="sidebar-icon"/>
        </div>
        <div :style="{left:(15+level*20)+'px'}" class="sidebar-label">
          {{ item.label }}
          <span :class="{'sidebar-arrow-reverse':expand[index]}" class="sidebar-arrow" v-if="item.children">∧</span>
        </div>
      </div>
      <TreeItem :ref="'item'+index" v-if="item.children"
                @outer-expand="$emit('outer-expand')"
                :style="{height:expand[index]?item.children.length*40+'px':'0'}"
                :class="{'sidebar-item-show':expand[index],'sidebar-item-hide-show':!outerExpand}" :nav="item.children"
                :level="level+1" :outer-expand="outerExpand"
                @active="setChildrenActive(index)"></TreeItem>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Nav} from "@/components/SideBar/SideBar.vue";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "TreeItem",

  components: {
    SvgIcon
  },

  data() {
    return {
      expand: [] as boolean[],
      childrenActive: [] as boolean[]
    };
  },

  created() {
    this.updateChildrenActive();
  },

  computed: {
    path() {
      return this.$route.path;
    }
  },

  watch: {
    path() {
      this.updateChildrenActive();
    }
  },

  methods: {
    onItemClick(index: number) {
      if (!this.nav)
        return;
      const link = this.nav[index].link;
      if (link) {
        this.$router.push(link);
      }
      if (!this.nav[index].children)
        return;
      if (this.expand[index]) {
        this.expand[index] = false;
        (this.$refs['item' + index] as any)[0].hideAll();
      } else {
        if (!this.outerExpand) {
          this.$emit('outer-expand');
        }
        this.expand[index] = true;
      }
    },

    setChildrenActive(index: number) {
      this.childrenActive[index] = true;
      this.$emit('active');
    },

    updateChildrenActive() {
      this.childrenActive = [];
      if (!this.nav)
        return;
      // if (this.nav.length != 0)
      //   return;
      for (let i = 0; i < this.nav.length; i++) {
        const item = this.nav[i];
        if (item.children)
          continue;
        if (item.link == this.$route.path) {
          this.childrenActive[i] = true;
          this.$emit('active');
          break;
        }
      }
    },

    hideAll() {
      if (!this.nav)
        return;
      for (let i = 0; i < this.nav.length; i++) {
        if (!this.nav[i].children)
          continue;
        this.expand[i] = false;
        (this.$refs['item' + i] as any)[0].hideAll();
      }
    }
  },

  emits: ['outer-expand', 'active'],

  props: {
    nav: {
      type: Array as PropType<Nav[]>
    },
    level: {
      type: Number as PropType<number>,
      default: 0
    },
    outerExpand: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  }
});
</script>

<style>

</style>