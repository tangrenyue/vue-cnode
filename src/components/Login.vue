<template>
  <div>
    <h5>login</h5>
    <group title="使用icon代替title">
      <x-input placeholder="Access Token" v-model="accessToken"></x-input>
    </group>
    <x-button type="primary" @click.native="login">login</x-button>
  </div>
</template>

<script>
import { Group, XButton, XInput } from "vux";
import { mapMutations } from "vuex";

export default {
  name: "login",

  components: {
    Group,
    XButton,
    XInput
  },

  data() {
    return {
      accessToken: ""
    };
  },

  methods: {
    ...mapMutations([
      "mutationsLogin",
      "mutationsLoginname",
      "mutationsAccessToken"
    ]),

    login() {
      if (!this.accessToken) {
        this.tip("access token不能为空");
      } else {
        this.$http
          .post("/accesstoken", {
            accesstoken: this.accessToken.trim()
          })
          .then(res => {
            if (res.success) {
              //
              this.mutationsLogin();
              this.mutationsLoginname(res.data.loginname);
              this.mutationsAccessToken(this.accesstoken);
              //
              window.localStorage.setItem('loginStatus',true);
              window.localStorage.setItem('loginname',res.data.loginname);
              window.localStorage.setItem('accesstoken',this.accesstoken);
              this.$router.push(`/user/${res.data.loginname}`);
            }
          })
          .catch(e => {
            this.tip(e.responseJSON.error_msg);
          });
      }
    },
    tip(message) {
      var timer = null;
      clearTimeout(timer);
      this.message = message;
      this.show = true;
      timer = setTimeout(() => {
        this.show = false;
      }, 2000);
    }
  }
};
</script>

<style>
</style>
