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
                @hide-bar="$emit('hide-bar')"
                @outer-expand="$emit('outer-expand')"
                :style="{height:expand[index]?childrenHeight[index]*40+'px':'0'}"
                :class="{'sidebar-item-show':expand[index],'sidebar-item-hide-show':!outerExpand}" :nav="item.children"
                :level="level+1" :outer-expand="outerExpand"
                @active="setChildrenActive(index)"
                @update-height="updateChildrenLength(index)"></TreeItem>
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
      childrenActive: [] as boolean[],
      childrenHeight: [] as number[]
    };
  },

  created() {
    this.updateChildrenActive();

    if (!this.nav)
      return;
    for (let i = 0; i < this.nav.length; i++)
      this.childrenHeight[i] = 0;
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
      // console.log(index);
      if (!this.nav)
        return;
      const link = this.nav[index].link;
      if (link) {
        this.$router.push(link);
      }
      if (!this.nav[index].children) {
        if (window.innerWidth <= 768) {
          this.$emit('hide-bar');
        }
        return;
      }
      if (this.expand[index]) {
        this.expand[index] = false;
        (this.$refs['item' + index] as any)[0].hideAll();
      } else {
        if (!this.outerExpand) {
          this.$emit('outer-expand');
        }
        this.expand[index] = true;
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.nav[index].expand = this.expand[index];

      this.updateChildrenLength(index);
      this.$emit('update-height');
    },

    updateChildrenLength(index: number) {
      if (!this.nav)
        return;

      // console.log(1);
      const getLength = (nav: Nav) => {
        if (!nav.children)
          return 0;
        let length = 0;
        if (nav.expand)
          length = nav.children.length;
        for (const item of nav.children) {
          length += getLength(item);
        }
        return length;
      };
      this.childrenHeight[index] = getLength(this.nav[index]);
      // console.log(this.childrenHeight[index]);

      // return getLength(this.nav[index]);
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
        // console.log('item' + i);
        (this.$refs['item' + i] as any)[0].hideAll();
      }
    }
  },

  emits: ['outer-expand', 'active', 'hide-bar', 'update-height'],

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