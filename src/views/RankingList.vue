<template>
  <div style="width: 95%">
    <div class="box">
      <div style="text-align: center;margin-bottom: 20px">排行榜</div>
      <table style="width: 100%" class="table">
        <tr>
          <th>
            排名
          </th>
          <th>
            玩家
          </th>
          <th>
            分数
          </th>
          <th>
            擦弹
          </th>
          <th>
            关卡
          </th>
          <th>
            时间
          </th>
        </tr>
        <tr v-for="(item,index) in rankingList" :key="item.id">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ item.nickname ? item.nickname : item.username }}
          </td>
          <td>
            {{ item.score }}
          </td>
          <td>
            {{ item.rubTimes }}
          </td>
          <td>
            {{ item.level }}
          </td>
          <td>
            {{ new Date(item.reachTime).toLocaleString() }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";
import {ResponseData} from "@/model";

export default defineComponent({
  name: "RankingList",

  data() {
    return {
      rankingList: []
    };
  },

  methods: {
    getList() {
      this.$store.commit('setLoading', true);
      axios.get('/game/getGameRecords', {
        params: {
          all: true
        }
      }).then((res) => {
        const data: ResponseData = res.data;
        if (data.errCode == 0) {
          this.rankingList = data.data;
        }
      }).finally(() => {
        this.$store.commit('setLoading', false);
      });
    }
  },

  created() {
    this.getList();
  }
});
</script>

<style lang="scss" scoped>
.table{
  th{
    text-align: left;
  }
}
</style>