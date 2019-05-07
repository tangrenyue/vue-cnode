<template>
  <div id="app">
    <x-header
      :right-options="{showMore: true}"
      @on-click-more="isShowMoreMenus = true"
      @on-click-title="routeToHome"
    >cnode</x-header>

    <router-view></router-view>
    <actionsheet :menus="moreMenus" v-model="isShowMoreMenus" @on-click-menu="handleClickMoreMenu"></actionsheet>
      <vm-back-top></vm-back-top>
  </div>
</template>

<script>
import { XHeader, Actionsheet } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import VmBackTop from 'vue-multiple-back-top'
export default {
  name: "app",
  components: {
    XHeader,
    Actionsheet,
    VmBackTop
  },
  computed: {
    ...mapGetters(["moreMenus"]),
    ...mapState([
      "topics",
      "loginedMoreMenus",
      "unLoginedMoreMenus",
      "isLogined"
    ]),
    isShowMoreMenus: {
      get: function() {
        return this.$store.state.isShowMoreMenus;
      },
      set: function(nval) {
        this.$store.commit("mutationsIsShowMoreMenus", nval);
      }
    }
  },
  data: function() {
    return {};
  },
  methods: {
    ...mapMutations([
      "mutationsLogin",
      "mutationsLoginname",
      "mutationsAccessToken"
    ]),
    routeToHome() {
      this.$router.replace("/");
    },
    handleClickMoreMenu(menukey) {
      this.$router.push("/" + menukey);
    }
  },
  created: function() {
    // `this` 指向 vm 实例
    loginStatus = window.localStorage.getItem("loginStatus");
    if (loginStatus) {
      this.mutationsLogin();
      this.mutationsLoginname(window.localStorage.getItem("loginname"));
      this.mutationsAccessToken(window.localStorage.getItem("accesstoken"));
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";

body {
  background-color: #fbf9fe;
}
</style>
