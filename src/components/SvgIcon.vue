<template>
  <svg class="svg-class" :class="className">
    <use :href="'#icon-' + iconName"></use>
  </svg>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'SvgIcon',
  props: {
    //图标名称 如 home
    iconName: {
      type: String,
      default: ""
    },
    //对不同区域的 icon 样式调整，如字体大小
    className: {
      type: String,
      default: ""
    }
  },
  setup() {
    //获取当前 svg 目录所有为 .svg 结尾的文件
    const req = require.context('@/assets/svg', true, /\.svg$/)

    //解析获取的 .svg 文件的文件名称，并返回
    const requireAll = (requireContext: any) => {
      return requireContext.keys().map(requireContext);
    }
    requireAll(req)
  }
});
</script>

<style lang="scss">
.svg-class {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>