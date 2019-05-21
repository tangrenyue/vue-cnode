<template>
  <div v-if="userinfo">
    <!-- 加了v-if避免渲染延迟的问题 -->
    <card :header="{ title: userinfo.loginname }" :footer="{ title: createAt }">
      <div slot="content" class="card_content">
        <p>
          <img :src="userinfo.avatar_url" alt>
        </p>
        <p>用户积分：{{ userinfo.score }}</p>
        <p>{{collect_topics.length}}个话题被收藏</p>
        <p>
          <a :href="'https://github.com/'+userinfo.githubUsername">{{ userinfo.githubUsername }}</a>
        </p>
      </div>
    </card>

    <card :header="{ title: '最近发表的话题' }">
      <group slot="content">
        <cell
          v-for="(item, index) in userinfo.recent_topics"
          :key="index"
          :title="item.title"
          is-link
          :link="'/topic/'+item.id"
        ></cell>
      </group>
    </card>
  </div>
</template>

<script>
import { calTime } from "../util.js";
import { Card, Group, Cell } from "vux";
export default {
  name: "User",
  props: ["loginname"],
  components: {
    Card,
    Group,
    Cell
  },
  computed: {
    createAt() {
      return "创建于:" + calTime(this.userinfo.create_at);
    }
  },

  data() {
    return {
      userinfo: null,
      collect_topics: []
    };
  },

  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      // 这里为什么不能用vm，而是用to.params
      vm.$http.get("/user/" + to.params.loginname).then(resp => {
        vm.userinfo = resp.data.data;
      });
      // 获取用户收藏的主题信息
      vm.$http.get("/topic_collect/" + to.params.loginname).then(resp => {
        vm.collect_topics = resp.data.data;
      });
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.$http.get("/user/" + to.params.loginname).then(resp => {
      this.userinfo = resp.data.data;
    });
    // 获取用户收藏的主题信息
    this.$http.get("/topic_collect/" + to.params.loginname).then(resp => {
      this.collect_topics = resp.data.data;
    });
    next();
  },

  methods: {}
};
</script>

<style lang="less" scoped>
.card_content {
  p {
    padding: 10px;
    color: rgb(46, 43, 43);
  }
  img {
    width: 60px;
    height: 60px;
  }
}
</style>