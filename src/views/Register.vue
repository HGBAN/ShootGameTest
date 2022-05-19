<template>
  <div class="container">
    <div class="box">
      注册
      <form>
        <div class="item">
          <div class="label">用户名：</div>
          <input autocomplete="off" v-model="username" class="input"/>
        </div>
        <div class="item">
          <div class="label">密码：</div>
          <input autocomplete="off" v-model="password" type="password" class="input"/>
        </div>
        <div class="item">
          <div class="label">昵称：</div>
          <input autocomplete="off" v-model="nickname" class="input"/>
        </div>
      </form>
      <div style="margin-top: 10px">
        <button class="btn" @click="register">注册</button>
        <button class="btn btn-blue" @click="$router.push('/login')">去登录</button>
      </div>
    </div>
    <Dialog v-model:show="showSucDialog">
      <template #title>
        注册成功
      </template>
      <div style="margin-bottom: 20px">账号已创建</div>
      <div style="text-align: center">
        <button class="btn" @click="$router.push('/login')">去登录</button>
        <button class="btn btn-blue" @click="showSucDialog=false">关闭</button>
      </div>
    </Dialog>
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
import axios from "axios";
import {ErrCode, ResponseData} from "@/model";

import Dialog from "@/components/Dialog.vue";

export default defineComponent({
  name: "Register",

  components: {
    Dialog
  },

  data() {
    return {
      username: '',
      password: '',
      nickname: '',

      showSucDialog: false,
      showErrDialog: false,
      errMsg: ''
    };
  },

  methods: {
    register() {
      axios.put('/user/register', {
        username: this.username,
        password: this.password,
        nickname: this.nickname
      }).then((res) => {
        const data: ResponseData = res.data;
        if (data.errCode == ErrCode.SUCCESS) {
          this.showSucDialog = true;
        } else {
          throw new Error(data.errMsg);
        }
      }).catch((err) => {
        // alert(err);
        this.errMsg = err.message;
        this.showErrDialog = true;
      });
    }
  },

  created() {

  },
});
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: aliceblue;
}

.box {
  border-style: solid;
  border-width: 3px;
  border-color: #a5bcce;
  background-color: #4f606e;
  color: aliceblue;
  width: 300px;
  padding: 10px;
  margin: 10px 0;
  min-height: 230px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.item {
  margin: 10px 0;
}

.label {
  display: inline-block;
  width: 80px;
}

.input {
  width: 180px;
  background-color: #a5bcce;
  border-style: solid;
  border-width: 1px;
  color: #2d2d72;
  height: 21px;
  outline: medium;
}

.btn {
  background-color: #64b059;
  border-style: none;
  width: 90px;
  height: 30px;
  color: aliceblue;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 10px;

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