<template>
  <div>
    <div class="item" v-for="item in items" :key="item.tag" @click="onMouseEnter(item)"
         :class="{'item-choose':item===currentInfo,'item-equip':weaponInfoIndex[item.tag].equip,'item-equip-choose':item===currentInfo&&weaponInfoIndex[item.tag].equip}">
      <div class="mask" v-if="item.currentLevel===0">
        <svg-icon class-name="lock-icon" icon-name="lock"></svg-icon>
      </div>
      <div style="display: flex">
        <div class="select-icon" :class="{'select-icon-active':weaponInfoIndex[item.tag].equip}">
          <svg-icon class-name="icon" icon-name="select"></svg-icon>
        </div>
        <span style="vertical-align: middle;margin-left: 10px">{{ item.name }}</span>
        <div class="money">
          <span style="vertical-align: middle;margin-right: 5px">{{ weaponPrice(item) }}</span>
          <svg-icon class-name="icon" icon-name="coin"></svg-icon>
        </div>
      </div>
      <div class="level-bar-container">
        <div v-for="bar in item.maxLevel" :key="bar" class="level-bar"
             :class="{'level-bar-active':bar<=item.currentLevel}">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import { WeaponInfo} from "@/model";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "WeaponChooseBox",

  components: {SvgIcon},

  emits: ['itemChoose'],

  data() {
    return {
      currentInfo: null as WeaponInfo | null
    }
  },

  methods: {
    onMouseEnter(info: WeaponInfo) {
      this.currentInfo = info;
      this.$emit('itemChoose', info);
    },

    weaponPrice(info: WeaponInfo) {
      if (info.currentLevel < info.maxLevel) {
        return info.price[info.currentLevel].toString();
      } else {
        return 'MAX';
      }
    }
  },

  props: {
    //需要显示在列表中的武器信息
    items: {
      type: Array as PropType<WeaponInfo[]>,
      default: (): WeaponInfo[] => []
    },
    //装备的武器信息
    weaponInfoIndex: {
      type: Object as PropType<{ [index: string]: WeaponInfo }>,
      default: (): { [index: string]: WeaponInfo } => {
        return {};
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.item {
  position: relative;

  min-height: 80px;
  border-style: solid;
  border-width: 2px;
  border-color: #667c8d;
  margin: 10px 0;
  cursor: pointer;
  padding: 10px;

  transition: background-color 0.5s;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  &:hover {
    background-color: #667c8d;
  }
}

.item-choose {
  background-color: #617786;
}

.item-equip {
  background-color: #61867d;
  border-color: #4f6c65;

  &:hover {
    background-color: #6c988d;
  }
}

.item-equip-choose {
  background-color: #6c988d;
}

//等级条容器
.level-bar-container {
  display: flex;
  justify-content: space-around;
}

//等级条
.level-bar {
  border-style: solid;
  border-color: #354049;
  height: 10px;
  width: 100%;
  margin: 0 3px;
}

//激活的等级条
.level-bar-active {
  background-color: #354049;
}

//选中图标
.select-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  color: #394650;
}

//选中图标激活
.select-icon-active {
  width: 20px;
  height: 20px;
  display: inline-block;
  color: #92c588;
}

.icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

//金钱显示
.money {
  margin-left: auto;
  display: inline-block;
  color: #d0b634;
  vertical-align: middle;
  //width: 100px;
  height: 20px;
}

//锁定遮罩
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(10, 10, 10, 0.5);
}

.lock-icon {
  position: relative;
  top: calc(50% - 10px);
  left: calc(50% - 10px);
}
</style>