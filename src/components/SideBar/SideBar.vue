<template>
  <div class="sidebar-outer">
    <div class="sidebar-expand-container" :class="{'sidebar-expand-container-reverse':!expand}"
         @click="expand=!expand;$refs.items.hideAll()">
      ∧
    </div>
    <div class="sidebar-container" :class="{'sidebar-container-hide':!expand}">
      <TreeItem @outer-expand="this.expand=true" :outer-expand="expand" ref="items" :nav="nav"></TreeItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TreeItem from "@/components/SideBar/TreeItem.vue";
</script>

<script lang="ts">
import {defineComponent} from "vue";

export interface Nav {
  label: string;
  link: string;
  icon?: string;
  children?: Nav[];
}

export default defineComponent({
  name: "SideBar",

  data() {
    return {
      expand: true,
      nav: [
        {
          label: '主页',
          link: '',
          icon: 'home'
        },
        {
          label: '选项',
          link: '',
          children: [
            {
              label: '选项1',
              link: '',
            },
            {
              label: '选项2',
              link: '',
            }
          ]
        },
        {
          label: '选项',
          link: '',
          children: [
            {
              label: '选项1',
              link: '',
              children: [
                {
                  label: '选项1-1',
                  link: '',
                },
                {
                  label: '选项1-2',
                  link: '',
                }]
            },
            {
              label: '选项2',
              link: '',
            }
          ]
        }
      ] as Nav[]
    };
  }

});
</script>

<style lang="scss">
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
          overflow:hidden;
          text-overflow:ellipsis;
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
    }
  }
}

.sidebar-container-hide {
  width: 50px;

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
  left: 20px;
  top: 5px;

  font-size: 20px;
  color: #a7a3ad;
  transform: rotateZ(-90deg);
  transition: transform 0.4s;

  cursor: pointer;
  //background-color: #36424b;
  //box-shadow: 2px 2px 4px #000000;
  //text-shadow: 2px 2px 4px #000;
}

.sidebar-expand-container-reverse {
  transform: rotateZ(90deg);
}


.sidebar-icon-container {
  width: 25px;
  height: 25px;
  display: inline-block;
  position: relative;

  .sidebar-icon {
    color: #a7a3ad;
  }
}


@media screen and (max-width: 768px) {
  .sidebar-outer {
    right: 0;
    background-color: transparent;
  }

  .sidebar-container {
    width: 100%;
    background-color: #36424b;
  }

  .sidebar-container-hide {
    width: 0;
  }
}
</style>