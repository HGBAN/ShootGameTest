<!--全屏的遮罩-->
<template>
  <transition name="fade">
    <div class="mask" v-show="show" @click="onClick">
      <div @click="$event.stopPropagation()">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: "Mask",

  data() {
    return {
      // show: true
    }
  },

  emits: ['update:show'],

  methods: {
    onClick() {
      if (this.canClose) {
        this.$emit('update:show', false);
      }
    }
  },

  props: {
    canClose: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    show: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
.mask {
  background-color: rgb(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  right: 0;
  top: -100px;
  bottom: -100px;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>