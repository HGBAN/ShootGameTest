<template>
  <div class="container">
    <div class="box">
      <form>
        <div class="item">
          <div class="label">用户名：</div>
          <input autocomplete="off" v-model="username" class="input"/>
        </div>
        <div class="item">
          <div class="label">密码：</div>
          <input autocomplete="off" v-model="password" type="password" class="input"/>
        </div>
      </form>
      <div style="margin-top: 10px">
        <button class="btn" @click="login">登录</button>
        <button class="btn btn-blue">注册</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";
import {ErrCode, ResponseData} from "@/model";

export default defineComponent({
  name: "Login",

  data() {
    return {
      jumpPath: null as null | string,
      username: '',
      password: ''
    };
  },

  methods: {
    login() {
      axios.post('/user/login', {
        username: this.username,
        password: this.password
      }).then((res) => {
        const data: ResponseData = res.data;
        if (data.errCode == ErrCode.SUCCESS) {
          if (this.jumpPath) {
            this.$router.push(this.jumpPath);
          } else {
            this.$router.push('/description');
          }
        }
      }).catch((err) => {
        alert(err);
      });
    }
  },

  created() {
    this.jumpPath = this.$route.query.path as string;
    axios({
      url: "/user/userInfo",
    })
        .then((res) => {
          if (res.data.errCode != 101) {
            this.$store.commit("setUser", res.data.data);
            this.$router.push('/description');
          }
        });
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
  min-height: 200px;

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