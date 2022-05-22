<template>
  <div style="width: 95%">
    <div class="box">
      <div style="text-align: center">介绍</div>
      <div>
        <p class="para">
          欢迎！这是一个使用TypeScript和PIXI开发的简单的弹幕射击游戏，目前尚处于开发测试阶段，如果发现bug可以提交到GitHub。
        </p>
        <p class="para">
          支持移动端。
        </p>
        <p class="para">
          GitHub地址：<a href="https://github.com/HGBAN/ShootGameTest">https://github.com/HGBAN/ShootGameTest</a>
        </p>
        <div style="text-align: center">
          <button class="btn" @click="$router.push('/game')">进行游戏</button>
          <button class="btn btn-blue" @click="$router.push('/weapon')">进入商店</button>
        </div>
      </div>
    </div>
    <div class="box">
      <div style="text-align: center">操作</div>
      <div>
        <p class="para">
          电脑端可使用wasd来控制方向，k键释放消弹。
        </p>
        <p class="para">
          移动端可通过向上下左右进行滑动来控制方向，快速双击屏幕释放消弹（可能不太灵敏，请多点几次）。
        </p>
      </div>
    </div>
    <div class="box">
      <div style="text-align: center">机制</div>
      <div>
        <p class="para">
          1.消弹
        </p>
        <p class="para">
          当玩家靠近子弹时，会积攒消弹槽：
        </p>
        <div style="text-align: center">
          <img :src="require('@/assets/page/1.jpg')"/>
        </div>
        <p class="para">
          当消弹槽满了以后，会增加下方的数字，代表可进行全屏消弹的次数：
        </p>
        <div style="text-align: center">
          <img :src="require('@/assets/page/2.jpg')"/>
        </div>
        <p class="para">
          之后就可以按下k键或双击屏幕来释放消弹效果了。
        </p>

        <p class="para">
          2.金币和商店
        </p>
        <p class="para">
          击杀敌人有概率获得金币：
        </p>
        <div style="text-align: center">
          <img style="transform: rotateZ(-90deg)" :src="require('@/assets/crystal.png')"/>
        </div>
        <p class="para">
          之后便可进入商店购买或升级装备：
        </p>
        <div style="text-align: center">
          <img width="184" height="331" :src="require('@/assets/page/3.jpg')"/>
        </div>
        <p class="para">
          商店的购买信息会自动保存上传到服务器。
        </p>

        <p class="para">
          3.金币槽
        </p>
        <p class="para">
          擦弹或击杀敌人可以积攒金币槽：
        </p>
        <div style="text-align: center">
          <img :src="require('@/assets/page/4.jpg')"/>
        </div>
        <p class="para">
          金币槽积满之的在一段时间内击杀敌人可以获得更多的金币。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Description"
}
</script>

<style lang="scss" scoped>
.para {
  text-indent: 2em;
}
</style>