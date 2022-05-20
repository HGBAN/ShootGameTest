<template>
  <div>
    <Mask v-model:show="showDialog">
      <div class="dialog">
        <div class="header">
          <slot name="title"></slot>
        </div>
        <div class="content">
<!--          内容-->
          <slot></slot>
        </div>
      </div>
    </Mask>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Mask from "@/components/Mask.vue";

export default defineComponent({
  name: "Dialog",

  emits: ['update:show'],

  data() {
    return {
      showDialog: false
    }
  },

  watch: {
    show: {
      handler(val) {
        this.showDialog = val;
      },
      immediate: true
    },
    showSucDialog(val) {
      this.$emit('update:show', val);
    }
  },

  props: {
    show: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  components: {
    Mask
  }
});
</script>

<style lang="scss" scoped>
.dialog {
  width: 300px;
  //height: 200px;
  background-color: #667c8d;
  border-style: solid;
  border-width: 2px;
  border-color: #a5bcce;
  border-radius: 5px;

  padding: 10px;
}

.header {
  width: 100%;
  text-align: center;
  color: aliceblue;
}

.content {
  padding: 10px;
}
</style>