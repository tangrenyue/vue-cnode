<template>
  <div v-if="topic">
    <article class="weui-article">
      <div class="topic_header">
        <div class="topic_title">{{ topic.title }}</div>
        <ul>
          <li>· 发表于{{ topic.create_at }}</li>

          <li>· {{topic.visit_count}}次浏览</li>
        </ul>
        <div v-html="topic.content" class="topic_content markdown-body"></div>
      </div>
      <div id="reply">
        <div class="topbar">回复</div>
        <div v-if="topic.replies.length === 0" class="noReplyStyle">本文暂无评论...</div>
        <div v-for="(reply,index) in topic.replies" :key="index" class="replySec">
          <div class="replyUp">
            <span>#{{index+1}}楼</span>
            <span v-if="reply.ups.lenght>0">∆ {{ reply.ups.length}}</span>
            <span v-else></span>
          </div>
          <p v-html="reply.content" class="replyContentStyle markdown-body"></p>
        </div>
      </div>
    </article>
    <group>
      <cell-box v-for="(item, index) in topic.replies" :key="index">
        <flexbox>
          <flexbox-item :span="1/10"></flexbox-item>
          <flexbox-item></flexbox-item>
          <flexbox-item :span="1/4">
            <span>
              <emotion>强</emotion>
              {{item.ups.length}}
            </span>
            <span v-if="isLogined">回复</span>
          </flexbox-item>
        </flexbox>
      </cell-box>
    </group>
    <group>
      <x-textarea :placeholder="评论内容" :rows="8" v-model="replyContent"></x-textarea>
    </group>
    <x-button mini type="primary" @click.native="addReply(1)">评论</x-button>
  </div>
</template>

<script>
import {
  Group,
  CellBox,
  Flexbox,
  FlexboxItem,
  WechatEmotion,
  XTextarea,
  XButton
} from "vux";
import { mapState } from "vuex";
export default {
  name: "topic",
  props: ["id"],
  components: {
    Group,
    CellBox,
    Flexbox,
    FlexboxItem,
    WechatEmotion,
    XTextarea,
    XButton
  },
  data: function() {
    return {
      topic: null,
      replyContent: ""
    };
  },
  methods: {
    // 评论
    addReply(replyTab) {
      this.$http
        .post("/topic/" + this.topic.id + "/replies", {
          accesstoken: this.$$store.state.accessToken,
          content: this.replyContent
        })
        .then(res => {
          if (res.success) {
            this.tip("主题发布成功");
            setTimeout(() => {
              this.$router.push("/topiclist/dev");
            }, 2000);
          }
        })
        .catch(() => {
          this.tip("主题发布失败,请重新发布!");
        });
    }
  },
  computed: {
    ...mapState(["isLogined"])
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.$http.get("/topic/" + to.params.id).then(function(response) {
        vm.topic = response.data.data;
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    var that = this;
    this.$http.get("/topic/" + to.params.id).then(function(response) {
      that.topic = response.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
@import "~vux/src/styles/weui/weui.less";
.noReplyStyle {
  margin: 10px;
  padding-bottom: 10px;
  font-size: 12px;
  color: #778087;
}
.topbar {
  padding: 10px;
  background-color: #f6f6f6;
  height: 16px;
  font-size: 12px;
  margin-top: 10px;
}
.article:not(:first-child) {
  margin-right: 340px;
  margin-top: 15px;
}
#reply,
.topic_header {
  background-color: #fff;
}
#reply {
  margin-top: 15px;
  margin-bottom: 15px;
}
.replyUserImg {
  width: 30px;
  height: 30px;
  position: relative;
  bottom: -9px;
}
.topic_header a,
#reply a,
#reply span {
  font-size: 13px;
  color: #666;
  text-decoration: none;
}
.replySec {
  border-bottom: 1px solid #e5e5e5;
  padding: 0 10px;
}
.loading {
  text-align: center;
  padding-top: 300px;
}
.replyUp a:nth-of-type(2) {
  margin-left: 0px;
  display: inline-block;
}
.topic_header {
  padding: 10px;
}
.topic_title {
  font-size: 20px;
  font-weight: bold;
  padding-top: 8px;
}
.topic_header ul {
  list-style: none;
  padding: 0px 0px;
  margin: 6px 0px;
}
.topic_header li {
  display: inline-block;
  font-size: 12px;
  color: #838383;
}
.topic_content {
  border-top: 1px solid #e5e5e5;
  padding: 10px 10px;
}
.markdown-text img {
  width: 92% !important;
}
.replyContentStyle {
  padding: 10px 35px 0 35px;
}
@media screen and (max-width: 979px) {
  .article:not(:first-child) {
    margin: 10px 10px 10px;
  }
}
body {
  margin: 0;
}
.loader {
  position: absolute;
  top: 30%;
  left: 25%;
  margin-left: 10%;
  transform: translate3d(-50%, -50%, 0);
}
.dot {
  width: 24px;
  height: 24px;
  background: #3ac;
  border-radius: 100%;
  display: inline-block;
  animation: slide 1s infinite;
}
.dot:nth-child(1) {
  animation-delay: 0.1s;
  background: #32aacc;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #64aacc;
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: #96aacc;
}
.dot:nth-child(4) {
  animation-delay: 0.4s;
  background: #c8aacc;
}
.dot:nth-child(5) {
  animation-delay: 0.5s;
  background: #faaacc;
}
@-moz-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
@-o-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
@media screen and (max-width: 979px) {
  .loading {
    text-align: center;
    padding-top: 100px;
  }
  .loader {
    position: absolute;
    top: 30%;
    left: 35%;
    margin-left: 10%;
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>
