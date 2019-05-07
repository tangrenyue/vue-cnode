<template>
  <div v-if="userinfo">
    <card :header="{title: userinfo.loginname}" :footer="{title: userinfo.create_at}">
      <div slot="content" class="card_content">
        <div>
          <img src="userInfo.avatar_url">
        </div>
        <p>积分 ：{{userInfo.score}}</p>
        <p>注册时间 ：{{userInfo.create_at | formatDate}}</p>
      </div>
    </card>

    <card :header="{title: $t('最近参与的话题') }">
      <group slot="content">
        <cell title="cell"></cell>
      </group>
    </card>

    <div class="topics">
      <p>最近创建的话题</p>
    </div>
  </div>
</template>

<script>
import { Card, Cell, Group } from "vux";
export default {
  name: "user",
  props: ["loginname"],
  components: {
    Card,
    Cell,
    Group
  },
  data: function() {
    return {
      userinfo: ""
    };
  },

  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.$http.get("/user/" + to.params.loginname).then(function(res) {
        vm.userinfo = res.data.data;
      });
    });
  },

  beforeRouteUpdate(to, from, next) {
    var that = this;
    this.$http.get("/user/" + to.params.loginname).then(function(res) {
      that.userinfo = res.data.data;
    });
    next();
  }
};
</script>

<style>
</style>
