<template>
  <div ref="gameContainer" style="width: 100%;height: 100%">
    <Game ref="game"></Game>
  </div>
</template>

<script lang="ts" setup>
import Game from "@/components/Game.vue";
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      // clientWidth: 720,

    };
  },

  methods: {
    onResize() {
      (this.$refs.game as any).resize((this.$refs.gameContainer as HTMLDivElement).clientWidth);
    }
  },

  unmounted() {
    window.removeEventListener('resize', this.onResize);
  },

  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }
});
</script>

<style scoped>

</style>