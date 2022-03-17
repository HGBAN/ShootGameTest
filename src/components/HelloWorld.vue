<template>
  <div style="width: 100%;height: 100%">
    <canvas v-show="true" width="720" height="1280" ref="canvas" class="canvas"
            :style="{width:width+'px',height:height+'px'}"></canvas>
    <!--    <div class="canvas" :style="{width:width+'px',height:height+'px'}"></div>-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {GameMain} from "@/scripts/engine/GameMain";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";

const Hammer = require('hammerjs');

export default defineComponent({
  name: 'HelloWorld',
  data() {
    return {
      width: 720,
      height: 1280
    };
  },
  methods: {
    resize() {
      let width = document.body.clientWidth;
      let height = document.body.clientHeight;


      // this.height = width * 16 / 9;
      if (width * 16 / 9 > height) {
        this.width = height * 9 / 16;
        this.height = height;
      } else {
        this.width = width;
        this.height = width * 16 / 9;
      }

      // this.width=width;
      // this.height=height;
      // console.log(width,height);
      // console.log(this.width,this.height);
    }
  },
  props: {
    msg: String,
  },
  mounted() {
    const hammer = new Hammer(document.querySelector('.canvas'));
    hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});

    hammer.on('pan', function (e: any) {
      // e.target.classList.toggle('expand');
      // console.log("You're pressing me!");
      // console.log(e);

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
    this.resize();
    window.addEventListener('resize', (e) => {
      // console.log(e);
      this.resize();
    });

    // window.addEventListener("load",function(){
    //   setTimeout(scrollTo,0,0,1);
    // },false);

    // document.body.addEventListener("touchmove", (e)=>{e.preventDefault()}, false);

    // document.addEventListener('touchmove', function(event) {
    //   event.preventDefault();
    // });
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

    // document.addEventListener('touchmove', (e) => {
    //   console.log(e);
    //   e.preventDefault();
    //   e.stopPropagation();
    // });

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
  //width: 720px;
  //height: 1280px;
  //width: 100%;
  //height: 100%;
  //position: absolute;
  border-style: solid;
  border-width: 10px;

  box-sizing: border-box;
  display: block;
}
</style>
