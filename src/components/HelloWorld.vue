<template>
  <div style="width: 100%;height: 100%">
    <canvas width="1600" height="1200" ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {GameMain} from "@/scripts/engine/GameMain";
import {Input} from "@/scripts/engine/Input";

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  mounted() {
    let canvas = this.$refs.canvas as HTMLCanvasElement;
    // let context = canvas.getContext('2d');
    // if (!context)
    //   throw new Error('context为null');
    // context.fillRect(0, 0, 100, 100);
    const gameMain = new GameMain(canvas);

    // window.onfocus = () => {
    //   requestAnimationFrame(gameMain.getStartTimeCallback);
    //   console.log("Df");
    // }

    document.addEventListener('visibilitychange', () => {
      gameMain.resetTime = true;
      Input.reset();
    });

    document.addEventListener('keydown', (e) => {
      Input.keyDown(e.key);
    });

    document.addEventListener('keyup', (e) => {
      Input.keyUp(e.key);
    })

    gameMain.resetTime = true;
    requestAnimationFrame(gameMain.gameLoopCallback);

    // for(let i=0;i<1000000;i++)
    //   console.log("1");
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.canvas {
  width: 800px;
  height: 600px;
  //width: 100%;
  //height: 100%;
  //position: absolute;
  border-style: solid;
}
</style>
