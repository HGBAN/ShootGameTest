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
    }
  },

  computed: {
    user() {
      return this.$store.state.user;
    }
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
</style>