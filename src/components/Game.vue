<template>
  <div ref="container" class="container">
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {GameMain} from "@/scripts/engine/GameMain";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";

const Hammer = require('hammerjs');

export default defineComponent({
  data() {
    return {
      width: 720,
      height: 1280,
      gameMain: new GameMain()
    };
  },
  methods: {
    resize() {
      let width = document.body.clientWidth;
      let height = document.body.clientHeight;

      if (width * 16 / 9 > height) {
        this.width = height * 9 / 16;
        this.height = height;
      } else {
        this.width = width;
        this.height = width * 16 / 9;
      }

      this.gameMain.app.view.style.width = this.width + 'px';
      this.gameMain.app.view.style.height = this.height + 'px';
    }
  },
  props: {
    msg: String,
  },
  mounted() {
    // const gameMain = new GameMain();
    let container = this.$refs.container as HTMLDivElement;
    this.gameMain.app.view.className = 'canvas';
    container.appendChild(this.gameMain.app.view);

    this.resize();
    window.addEventListener('resize', (e) => {
      // console.log(e);
      this.resize();
    });

    document.addEventListener('visibilitychange', () => {
      this.gameMain.resetTime = true;
      Input.reset();
    });

    document.addEventListener('keydown', (e) => {
      Input.keyDown(e.key);
    });

    document.addEventListener('keyup', (e) => {
      Input.keyUp(e.key);
    });

    const hammer = new Hammer(document.querySelector('.canvas'));
    hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});

    hammer.on('pan', function (e: any) {

      let dir = new Vec2(e.velocityX, e.velocityY);
      let dis = dir.dis;
      if (dis > 0.1) {
        Input.moveDir = new Vec2(dir.x / dis, dir.y / dis);
      }
      // console.log(Input.moveDir);
    });

    hammer.on('panend', function (e: any) {
      Input.moveDir = Vec2.zero;
    });

    hammer.on('pancancel', function (e: any) {
      Input.moveDir = Vec2.zero;

    });

    hammer.on('doubletap', function (e: any) {
      // if (e.maxPointers == 2) {
      Input.doubleTap = true;
      // }
    });

    this.gameMain.resetTime = true;

  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.canvas {
  //width: 720px;
  //height: 1280px;
  //width: 100%;
  //height: 100%;
  //position: absolute;
  border-style: solid;
  border-width: 10px;
  border-color: #1d2328;

  box-sizing: border-box;
  display: block;

  //background-color: #36424b;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
