<template>
  <div class="outer">
    <div class="box head">
      <svg-icon icon-name="bag" class-name="icon"></svg-icon>
      <div style="vertical-align: middle;margin-left: auto;margin-right: 5px">{{ money }}</div>
      <svg-icon icon-name="coin" class-name="icon"></svg-icon>
    </div>
    <div class="box">
      <div v-if="this.currentInfo">
        <div style="text-align: center">{{ this.currentInfo.name }}</div>
        描述：{{ this.currentInfo.description }}
        <br/>
        等级：{{ this.currentInfo.currentLevel }}/{{ this.currentInfo.maxLevel }}
        <br/>
        <div style="display: flex;justify-content: center;margin-top: 20px">
          <button v-if="this.currentInfo.currentLevel>0" class="btn" @click="upgrade">
            <svg-icon class-name="btn-icon" icon-name="upgrade"></svg-icon>
            <span
                style="vertical-align: middle;margin-left: 5px">升级（{{
                currentPrice
              }}</span>
            <svg-icon style="margin-left: 3px;" class-name="btn-icon" icon-name="coin"></svg-icon>
            <span style="vertical-align: middle">）</span>
          </button>
          <button v-else class="btn" @click="upgrade">
            <svg-icon class-name="btn-icon" icon-name="bag"></svg-icon>
            <span
                style="vertical-align: middle;margin-left: 5px">购买（{{
                currentPrice
              }}</span>
            <svg-icon style="margin-left: 3px;" class-name="btn-icon" icon-name="coin"></svg-icon>
            <span style="vertical-align: middle">）</span>
          </button>
          <button @click="equip" v-if="this.currentInfo.currentLevel>0" class="btn btn-blue">
            <svg-icon style="margin-right: 3px" v-if="equipInfo[currentInfo.tag]" class-name="btn-icon"
                      icon-name="select"></svg-icon>
            <span style="vertical-align: middle">
              {{ equipInfo[currentInfo.tag] ? '已装备' : '装备' }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="box">
      <WeaponChooseBox @item-choose="onItemChoose" :items="weaponInfo" :equip-info="equipInfo">

      </WeaponChooseBox>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import WeaponChooseBox from "@/components/WeaponChooseBox.vue";
import {WeaponInfo} from "@/model";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "Weapon",

  components: {
    SvgIcon,
    WeaponChooseBox
  },

  methods: {
    //点击某一项
    onItemChoose(info: WeaponInfo) {
      this.currentInfo = info;
    },

    //装备或取消装备武器
    equip() {
      if (!this.currentInfo)
        return;
      const tag = this.currentInfo.tag;
      this.equipInfo[tag] = !this.equipInfo[tag];
    },

    //升级当前武器
    upgrade() {
      if (!this.currentInfo)
        return;
      if (this.currentInfo.currentLevel >= this.currentInfo.maxLevel)
        return;
      const price = this.currentInfo.price[this.currentInfo.currentLevel];
      if (this.money - price >= 0) {
        this.money -= price;
        this.currentInfo.currentLevel++;
      }
    }
  },

  computed: {
    currentPrice(): string {
      if (this.currentInfo) {
        if (this.currentInfo.currentLevel < this.currentInfo.maxLevel) {
          return this.currentInfo.price[this.currentInfo.currentLevel].toString();
        } else {
          return 'MAX';
        }
      }
      return '';
    }
  },

  data() {
    return {
      currentInfo: null as WeaponInfo | null,
      money: 100000,
      weaponInfo: [
        {
          tag: 'primary',
          name: '主炮',
          price: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
          currentLevel: 3,
          maxLevel: 10,
          description: '会向正前方发射连续、密集的子弹'
        },
        {
          tag: 'missile',
          name: '导弹发射器',
          price: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
          currentLevel: 5,
          maxLevel: 7,
          description: '发射会自动跟踪敌人的导弹'
        },
        {
          tag: 'fire',
          name: '火焰喷射器',
          price: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
          currentLevel: 0,
          maxLevel: 9,
          description: '每隔一段时间发射一道火焰'
        }
      ] as WeaponInfo[],
      equipInfo: {
        'missile': true
      } as { [index: string]: boolean }
    };
  }
});
</script>

<style lang="scss" scoped>
.outer {
  width: 95%;
  border-width: 0;
  display: inline-block;
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

.head {
  min-height: 40px;
  display: flex;
  color: #d0b634;
}

.icon {
  width: 20px;
  height: 20px;
}

.btn-icon {
  vertical-align: middle;
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
</style>