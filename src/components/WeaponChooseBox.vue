<template>
  <div>
    <div class="item" v-for="item in items" :key="item.name" @click="onMouseEnter(item)"
         :class="{'item-choose':item===currentInfo}">
      <div class="mask" v-if="item.currentLevel===0">
        <svg-icon class-name="lock-icon" icon-name="lock"></svg-icon>
      </div>
      <div style="display: flex">
        <div class="select-icon">
          <svg-icon class-name="icon" icon-name="select"></svg-icon>
        </div>
        <span style="vertical-align: middle;margin-left: 10px">{{ item.name }}</span>
        <div class="money">
          <span style="vertical-align: middle;margin-right: 5px">50</span>
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
import {Pair, WeaponInfo} from "@/model";
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
    }
  },

  props: {
    items: {
      type: Array as PropType<WeaponInfo[]>,
      default: [] as WeaponInfo[]
    },

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

//选中图标
.select-icon-active {
  width: 20px;
  height: 20px;
  display: inline-block;
  color: #64b059;
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