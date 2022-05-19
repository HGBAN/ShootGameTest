<template>
  <div>
    <div class="sidebar-expand-container" :class="{'sidebar-expand-container-reverse':!expand}"
         @click="expand=!expand;$refs.items.hideAll()">
      ∧
    </div>
    <div class="sidebar-outer" :class="{'sidebar-outer-hide':!expand}">
      <!--      <div class="sidebar-expand-container" :class="{'sidebar-expand-container-reverse':!expand}"-->
      <!--           @click="expand=!expand;$refs.items.hideAll()">-->
      <!--        ∧-->
      <!--      </div>-->
      <div class="sidebar-container" :class="{'sidebar-container-hide':!expand}">
        <TreeItem @hide-bar="this.expand=false" @outer-expand="this.expand=true" :outer-expand="expand" ref="items"
                  :nav="nav"></TreeItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import TreeItem from "@/components/SideBar/TreeItem.vue";

export interface Nav {
  label: string;
  link?: string;
  icon?: string;
  children?: Nav[];
}

export default defineComponent({
  name: "SideBar",

  components: {
    TreeItem
  },

  emits: ['expand-changed'],

  watch: {
    expand() {
      this.$emit('expand-changed', this.expand);
    }
  },

  props: {
    nav: {
      type: Array as PropType<Nav[]>,
      required: true
    }
  },

  unmounted() {
    window.removeEventListener('resize', this.onResize);
  },

  mounted() {
    this.onResize = () => {
      if (window.innerWidth <= 768) {
        this.expand = false;
      }
    };
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  data() {
    return {
      expand: true,
      onResize: () => {

      }
    };
  }

});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

.sidebar-outer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;

  box-shadow: 2px 2px 4px #000000;
  user-select: none;
  background-color: #36424b;
}

.sidebar-container {
  position: relative;
  width: 300px;
  height: 100%;
  overflow-x: hidden;
  padding-top: 40px;

  transition: width 0.5s;

  & > div {
    & > div {
      position: relative;
      cursor: pointer;

      div.sidebar-item {
        transform: scaleY(0);
        transform-origin: 50% 0;
        transition: transform 0.5s, height 0.5s;
        height: 0;
      }

      div.sidebar-item-show {
        transform: scaleY(1);
      }

      div.sidebar-item-hide-show {
        //position: fixed;
        //left: 50px;
        //div.sidebar-label {
        //  opacity: 1;
        //}
      }

      div.sidebar-label-container {
        background-color: #252d33;
        transition: background-color 0.5s;
        height: 40px;
        border-left-style: solid;
        border-left-width: 3px;
        border-left-color: transparent;

        div.sidebar-label {
          left: 40px;
          position: relative;
          color: #c9c4d0;
          font-size: 18px;
          line-height: 40px;
          transition: opacity 0.5s;
          display: inline-block;

          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:hover {
          background-color: #4f606e;
        }
      }

      & > div.sidebar-label-container {
        background-color: #36424b;

        div.sidebar-label {
          left: 20px;
          display: inline-block;
        }
      }

      div.sidebar-label-container-active {
        background-color: #44535e;
        border-left-color: #a5bcce;

        &:hover {
          background-color: #667c8d;
        }
      }
    }
  }
}

.sidebar-container-hide {
  width: 55px;

  & > div {
    & > div {
      div.sidebar-label {
        opacity: 0;
        //width: 300px;
      }

    }
  }
}

.sidebar-arrow {
  transform: rotateZ(180deg);
  transform-origin: 50% 53%;
  display: inline-block;
  transition: transform 0.4s;
}

.sidebar-arrow-reverse {
  transform: rotateZ(0);
}

.sidebar-expand-container {
  position: fixed;
  z-index: 11;
  left: 22px;
  top: 5px;

  font-size: 20px;
  color: #a7a3ad;
  transform: rotateZ(-90deg);
  transition: transform 0.4s;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
  //background-color: #36424b;
  //box-shadow: 2px 2px 4px #000000;
  //text-shadow: 2px 2px 4px #000;
}

.sidebar-expand-container-reverse {
  transform: rotateZ(90deg);
}

.sidebar-expand-mobile {
  display: none;
}

.sidebar-icon-container {
  width: 25px;
  height: 25px;
  display: inline-block;
  position: relative;
  top: -10px;

  .sidebar-icon {
    color: #a7a3ad;
    width: 20px;
    height: 20px;
  }
}


@media screen and (max-width: 768px) {
  .sidebar-outer {
    right: 0;
    background-color: transparent;
    transition: transform 0.5s;
  }

  .sidebar-outer-hide {
    //pointer-events: none
    transform: translateX(-100%);

  }

  .sidebar-container {
    width: 100%;
    background-color: #36424b;
    //opacity: 0.8;
  }

  .sidebar-container-hide {
    width: 100%;
  }

  //.sidebar-expand-mobile{
  //  display: block;
  //}
}
</style>