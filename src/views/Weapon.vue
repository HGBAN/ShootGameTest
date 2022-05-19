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
            <svg-icon style="margin-right: 3px" v-if="weaponInfoIndex[currentInfo.tag].equip" class-name="btn-icon"
                      icon-name="select"></svg-icon>
            <span style="vertical-align: middle">
              {{ weaponInfoIndex[currentInfo.tag].equip ? '已装备' : '装备' }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="box">
      <WeaponChooseBox @item-choose="onItemChoose" :items="weaponInfo" :weapon-info-index="weaponInfoIndex">

      </WeaponChooseBox>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import WeaponChooseBox from "@/components/WeaponChooseBox.vue";
import {ErrCode, ResponseData, WeaponInfo} from "@/model";
import SvgIcon from "@/components/SvgIcon.vue";
import axios from "axios";
import {weaponInfos} from "@/scripts/data/Weapons";

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
      this.weaponInfoIndex[tag].equip = !this.weaponInfoIndex[tag].equip;
      this.updateWeaponInfo(this.currentInfo);
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
      this.updateWeaponMoney(this.currentInfo);
    },

    //更新武器数据
    updateWeaponInfo(info: WeaponInfo) {
      axios.put('/game/addWeaponInfo', {
        tag: info.tag,
        level: info.currentLevel,
        equip: info.equip
      }).then((res) => {
        const data: ResponseData = res.data;
        if (data.errCode != ErrCode.SUCCESS) {
          throw new Error(data.errMsg);
        }
      }).catch((err) => {
        console.log(err.message);
      });
    },

    //更新武器和金钱数据
    updateWeaponMoney(info: WeaponInfo) {
      axios.put('/game/updateWeaponMoney', {
        money: this.money,
        tag: info.tag,
        level: info.currentLevel,
        equip: info.equip
      }).then((res) => {
        const data: ResponseData = res.data;
        if (data.errCode != ErrCode.SUCCESS) {
          throw new Error(data.errMsg);
        }
      }).catch((err) => {
        console.log(err.message);
      });
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
      money: 100,
      weaponInfo: weaponInfos(),
      weaponInfoIndex: {
        // 'missile': true
      } as { [index: string]: WeaponInfo }
    };
  },

  created() {
    //建立索引
    for (const info of this.weaponInfo) {
      this.weaponInfoIndex[info.tag] = info;
    }
    axios.get('/game/shopInfo').then((res) => {
      const data: ResponseData = res.data;
      if (data.errCode == ErrCode.SUCCESS) {
        this.money = data.data.money;
        for (const info of data.data.weaponInfos) {
          this.weaponInfoIndex[info.tag].currentLevel = info.level;
          this.weaponInfoIndex[info.tag].equip = info.equip;
        }
      }
    });
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