<template>
  <div>
    <Mask :can-close="false" v-model:show="isLoading">
      <svg-icon iconName="loading" className="loading"></svg-icon>
    </Mask>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Mask from "@/components/Mask.vue";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  components: {
    Mask,
    SvgIcon
  },

  computed: {
    isLoading() {
      return this.$store.state.loadingNum > 0;
    }
  }
});
</script>

<style lang="scss">
body {
  background-color: #303941;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading {
  width: 100px;
  height: 100px;

  animation: rotate 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  color: #bcc7d3;
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;

}

//.fade-enter-to,
//.fade-leave-from {
//  //opacity: 0;
//
//}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: rotateX(30deg);
}

.btn {
  background-color: #64b059;
  border-style: none;
  width: 90px;
  height: 40px;
  color: aliceblue;
  border-radius: 3px;
  cursor: pointer;
  margin: 10px;

  transition: background-color 0.5s;

  &:hover {
    background-color: #7cb973;
  }
}

.btn-blue {
  background-color: #3797d5;

  &:hover {
    background-color: #70a3d9;
  }
}

.box {
  border-style: solid;
  border-width: 3px;
  border-color: #a5bcce;
  background-color: #4f606e;
  color: aliceblue;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  min-height: 150px;
}
</style>
