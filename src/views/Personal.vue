<template>
  <div style="width: 95%">
    <div class="box">
      <div style="text-align: center">信息</div>
      <div class="form" v-if="user">
        <div class="item">
          <div class="label">用户名：</div>
          <div class="info">{{ user.username }}</div>
        </div>
        <div class="item">
          <div class="label">昵称：</div>
          <div class="info">{{ user.nickname }}</div>
        </div>
        <div class="item">
          <div class="label">金币：</div>
          <div class="info">{{ user.money }}</div>
        </div>
        <div class="item">
          <div class="label">注册时间：</div>
          <div class="info">{{ new Date(user.registerTime).toLocaleString() }}</div>
        </div>
        <div class="item">
          <div class="label">上次登录时间：</div>
          <div class="info">{{ new Date(user.lastLoginTime).toLocaleString() }}</div>
        </div>
      </div>
    </div>
    <div class="box" style="min-height: 0;">
      <div style="text-align: center">操作</div>
      <div style="text-align: center">
        <button class="btn btn-blue">修改信息</button>
        <button @click="logout" class="btn">退出登录</button>
      </div>
    </div>
    <div class="box">
      <div style="text-align: center;margin-bottom: 20px">游戏记录</div>
      <table style="width: 100%" class="table">
        <tr>
          <th>
            序号
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
import {ErrCode, ResponseData} from "@/model";

export default defineComponent({
  name: "Personal",

  methods: {
    logout() {
      this.$store.commit('setLoading', true);
      axios.post('/user/logout').then((res) => {
        const data: ResponseData = res.data;
        if (data.errCode == ErrCode.SUCCESS) {
          this.$router.push('/login');
        }
      }).finally(() => {
        this.$store.commit('setLoading', false);
      });
    },

    getList() {
      this.$store.commit('setLoading', true);
      axios.get('/game/getGameRecords', {
        params: {
          all: false
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

  data(){
    return {
      rankingList: []
    }
  },

  computed: {
    user() {
      return this.$store.state.user;
    }
  },

  created() {
    this.getList();
  }
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  width: 170px;
  //display: inline-block;
}

.item {
  margin: 10px;
  width: 240px;
  display: flex;
}

.info {
  //display: inline-block;
  text-align: right;
  margin-left: auto;
}

.table{
  th{
    text-align: left;
  }
}
</style>