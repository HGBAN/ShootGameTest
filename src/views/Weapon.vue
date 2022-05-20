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
      <div style="display: flex">
        <div>主武器</div>
        <div style="margin-left: auto">{{ primaryCurrent }}/{{ primaryMax }}</div>
      </div>
      <WeaponChooseBox @item-choose="onItemChoose" :items="weaponInfo" :weapon-info-index="weaponInfoIndex">

      </WeaponChooseBox>
    </div>
    <div class="box">
      <div style="display: flex">
        <div>辅助装备</div>
        <div style="margin-left: auto">{{ assistCurrent }}/{{ assistMax }}</div>
      </div>
      <WeaponChooseBox @item-choose="onItemChoose" :items="assistInfo" :weapon-info-index="weaponInfoIndex">

      </WeaponChooseBox>
    </div>
    <Dialog v-model:show="showErrDialog">
      <template #title>
        错误
      </template>
      <div style="margin-bottom: 20px;color: #ec9371">{{ errMsg }}</div>
      <div style="text-align: center">
        <button class="btn btn-blue" @click="showErrDialog=false">确认</button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import WeaponChooseBox from "@/components/WeaponChooseBox.vue";
import {ErrCode, ResponseData, WeaponInfo} from "@/model";
import SvgIcon from "@/components/SvgIcon.vue";
import axios from "axios";
import {weaponInfos} from "@/scripts/data/Weapons";
import Dialog from "@/components/Dialog.vue";

export default defineComponent({
  name: "Weapon",

  components: {
    SvgIcon,
    WeaponChooseBox,
    Dialog
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
      // const tag = this.currentInfo.tag;
      const type = this.currentInfo.type;

      if (type == 'primary') {
        if (!this.currentInfo.equip) {
          if (this.primaryCurrent + 1 > this.primaryMax) {
            this.errMsg = '装备已达上限';
            this.showErrDialog = true;
            return;
          }
          this.currentInfo.equip = true;
          this.primaryCurrent++;
        } else {
          this.currentInfo.equip = false;
          this.primaryCurrent--;
        }
        this.updateWeaponInfo(this.currentInfo);
      } else if (type == 'assist') {
        if (!this.currentInfo.equip) {
          if (this.assistCurrent + 1 > this.assistMax) {
            this.errMsg = '装备已达上限';
            this.showErrDialog = true;
            return;
          }
          this.currentInfo.equip = true;
          this.assistCurrent++;
        } else {
          this.currentInfo.equip = false;
          this.assistCurrent--;
        }
        this.updateWeaponInfo(this.currentInfo);
      }
      // this.weaponInfoIndex[tag].equip = !this.weaponInfoIndex[tag].equip;
      // if (this.weaponInfoIndex[tag].equip) {
      //   this.primaryCurrent++;
      //   if (this.primaryCurrent > this.primaryMax) {
      //     this.primaryCurrent--;
      //     this.weaponInfoIndex[tag].equip = !this.weaponInfoIndex[tag].equip;
      //     this.errMsg = '装备已达上限';
      //     this.showErrDialog = true;
      //   }
      // } else
      //   this.primaryCurrent--;
      // this.updateWeaponInfo(this.currentInfo);
    },

    //升级当前武器
    upgrade() {
      if (!this.currentInfo)
        return;
      if (this.currentInfo.currentLevel >= this.currentInfo.maxLevel) {
        this.errMsg = '等级已达上限';
        this.showErrDialog = true;
        return;
      }
      const price = this.currentInfo.price[this.currentInfo.currentLevel];
      if (this.money - price >= 0) {
        this.money -= price;
        this.currentInfo.currentLevel++;
        this.updateWeaponMoney(this.currentInfo);
      } else {
        this.errMsg = '金币不足';
        this.showErrDialog = true;
      }
    },

    //更新武器数据
    updateWeaponInfo(info: WeaponInfo) {
      this.$store.commit('setLoading', true);
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
      }).finally(() => {
        this.$store.commit('setLoading', false);
      });
    },

    //更新武器和金钱数据
    updateWeaponMoney(info: WeaponInfo) {
      this.$store.commit('setLoading', true);
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
      }).finally(() => {
        this.$store.commit('setLoading', false);
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
      weaponInfo: [] as WeaponInfo[],
      assistInfo: [] as WeaponInfo[],
      weaponInfoIndex: {
        // 'missile': true
      } as { [index: string]: WeaponInfo },

      //主武器装备数量上限
      primaryMax: 2,
      //当前主武器装备数量
      primaryCurrent: 0,

      assistMax: 2,
      assistCurrent: 0,

      showErrDialog: false,
      errMsg: ''
    };
  },

  created() {
    const infos = weaponInfos();
    for (const info of infos) {
      if (info.type == 'primary')
        this.weaponInfo.push(info);
      else if (info.type == 'assist')
        this.assistInfo.push(info);
      //建立索引
      this.weaponInfoIndex[info.tag] = info;
    }
    // //建立索引
    // for (const info of infos) {
    //   this.weaponInfoIndex[info.tag] = info;
    // }
    this.$store.commit('setLoading', true);
    axios.get('/game/shopInfo').then((res) => {
      const data: ResponseData = res.data;
      if (data.errCode == ErrCode.SUCCESS) {
        this.money = data.data.money;
        for (const info of data.data.weaponInfos) {
          this.weaponInfoIndex[info.tag].currentLevel = info.level;
          this.weaponInfoIndex[info.tag].equip = info.equip;
        }
      }
      for (const info of this.weaponInfo) {
        if (info.equip)
          this.primaryCurrent++;
      }
    }).finally(() => {
      this.$store.commit('setLoading', false);
    });
    this.currentInfo = this.weaponInfoIndex['primary'];
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