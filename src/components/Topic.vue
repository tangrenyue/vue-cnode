<template>
  <!-- 只有topic为真时才显示主题信息 -->
  <div v-if="topic" style="padding: 5px 8px;">
    <article>
      <section>
        <h2 class="topic-title">
          {{topic.title}}
          <x-button
            v-if="topic.author_id == $store.state.author_id"
            type="primary"
            :mini="true"
            :link="'/topic/'+topic.id+'/edit'"
          >编辑</x-button>
          <x-button
            v-if="topic.is_collect==false"
            :mini="true"
            type="primary"
            @click.native="collect"
          >收藏</x-button>
          <x-button v-else :mini="true" @click.native="decollect">取消收藏</x-button>
        </h2>
      </section>
      <section class="topic-msg">
        <!-- /#/代表路由路径 -->
        <div class="left" @click="$router.push('/#/user/'+topic.author.loginname)">
          <img :src="topic.author.avatar_url||''" alt>
          <div>
            <p>{{topic.author.loginname}}</p>
            <p>{{createAt}}</p>
          </div>
        </div>

        <div class="right">
          <p>{{topic.visit_count}} 次浏览</p>
          <p class="tag">
            来自:
            {{tag}}
          </p>
        </div>
      </section>
      <section v-html="topic.content" class="markdown-body"></section>
    </article>
    <h4 class="reply_count">
      <b>{{topic.reply_count}}</b> 回复
    </h4>

    <div v-for="(item,index) in topic.replies" :key="index">
      <flexbox>
        <!-- :span是划分区域面积 -->
        <flexboxItem :span="1/8">
          <img :src="item.author.avatar_url" width="30" height="30" alt>
        </flexboxItem>
        <flexboxItem>
          <div>
            <a :href="'/#/user/'+item.author.loginname">{{item.author.loginname}}</a>
            {{index+1}}楼
          </div>
        </flexboxItem>
        <flexboxItem :span="1/4">
          <span @click="upOrDown(item.id)">
            <wechat-emotion>强</wechat-emotion>
            {{item.ups.length}}
          </span>
          <span v-if="isLogined" @click="showPopup(item.id, item.author.loginname)">回复</span>
        </flexboxItem>
      </flexbox>
      <div v-html="item.content" class="markdown-body"></div>
    </div>

    <group>
      <x-textarea v-model="replyContent" placeholder="评论新内容"></x-textarea>
    </group>
    <x-button :mini="true" type="primary" @click.native="addReply(1)">回复</x-button>
    <!-- 对评论的评论 -->
    <div v-transfer-dom>
      <popup v-model="isShowPopup" @on-hide="hidePopup">
        <group>
          <x-textarea v-model="replyContent" placeholder="请输入评论内容"></x-textarea>
        </group>
        <x-button :mini="true" type="primary" @click.native="addReply(2)">回复</x-button>
      </popup>
    </div>
  </div>
</template>

<script>
import { calTime, titleVal } from "../util.js";
import {
  Group,
  FlexboxItem,
  Flexbox,
  WechatEmotion,
  XButton,
  XTextarea,
  Popup,
  TransferDom
} from "vux";
import { mapState } from "vuex";
export default {
  name: "Topic",
  // 接收父组件(路由组件)的id值
  props: ["id"],

  data() {
    return {
      topic: null,
      replyContent: "",
      isShowPopup: false,
      reply_id: null,
      reply_loginname: ""
    };
  },

  computed: {
    ...mapState(["isLogined"]),
    createAt() {
      return "发布于:" + calTime(this.topic.create_at);
    },
    tag() {
      return titleVal[this.topic.tab];
    }
  },
  components: {
    Group,
    XButton,
    XTextarea,
    FlexboxItem,
    Flexbox,
    WechatEmotion,
    Popup
  },
  directives: {
    TransferDom
  },
  // ajax获取的数据应赋值给一个自定义的变量来调用
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      vm.$http
        .get("/topic/" + to.params.id, {
          params: {
            accesstoken: vm.$store.state.accesstoken
          }
        })
        .then(function(resp) {
          // console.log(resp.data);
          // 注意区别data和data.data的区别
          vm.topic = resp.data.data;
        });
    });
  },
  // 动态路由切换时，导航守卫
  beforeRouteUpdate: function(to, from, next) {
    this.$http
      .get("/topic/" + to.params.id, {
        params: {
          accesstoken: this.$store.state.accesstoken
        }
      })
      .then((resp)=> {
        this.topic = resp.data.data;
      });
    next();
  },

  methods: {
    // 新建评论
    addReply(replyTab) {
      // 根据replyTab值实现不同的评论功能
      var params = {
        accesstoken: this.$store.state.accesstoken,
        content: this.replyContent
      };
      if (replyTab == 2) {
        params.reply_id = this.reply_id;
        // 构建@用户名形式的回复信息
        params.content = "@" + this.reply_loginname + " " + params.content;
      }
      // 发送ajax请求
      this.$http
        .post("/topic/" + this.topic.id + "/replies", params)
        .then(resp => {
          if (resp.data && resp.data.success) {
            var reply = {
              id: resp.data.reply_id,
              author: {
                loginname: this.$store.state.loginname,
                avatar_url: ""
              },
              content: params.content,
              ups: [],
              create_at: "2014-10-07",
              reply_id: null,
              is_uped: false
            };
            if (replyTab == 2) {
              reply.reply_id = this.reply_id;
            }
            this.topic.replies.push(reply);
            this.replyContent = "";
            this.reply_id = null;
            this.isShowPopup = false;
            this.reply_loginname = "";
          }
        });
    },
    // 点击回复显示弹出框
    showPopup(reply_id, loginname) {
      this.isShowPopup = true;
      this.reply_id = reply_id;
      this.reply_loginname = loginname;
    },
    hidePopup() {
      this.reply_id = "";
      this.reply_loginname = "";
    },
    // 实现点赞或取消点赞
    upOrDown(reply_id) {
      this.$http
        .post("/reply/" + reply_id + "/ups", {
          accesstoken: this.$store.state.accesstoken
        })
        .then(resp => {
          if (resp && resp.data && resp.data.success) {
            var type = resp.data.action;
            var reply;
            // 先获取到当前评论
            for (var i = 0; i <= this.topic.replies.length; i++) {
              if (this.topic.replies[i].id == reply_id) {
                // 找到了指定评论
                reply = this.topic.replies[i];
                break;
              }
            }
            // 实现点赞功能
            if (type == "up") {
              // 在ups中添加当前用户的id值
              reply.ups.push(this.$store.state.accesstoken);
            }
            // 取消点赞功能
            else if (type == "down") {
              // ？？实际过程中应该先找到指定元素的下标，然后再使用splice删除指定元素
              reply.ups.pop();
            }
          }
        });
    },
    // 实现收藏功能----500状态码错误,服务器内部错误
    collect() {
      this.$http
        .post("/topic_collect/collect", {
          accesstoken: this.$store.state.accesstoken,
          topic_id: this.topic_id
        })
        .then(resp => {
          if (resp.data && resp.data.success) {
            this.topic.is_collect = true;
          }
        });
    },
    // 取消收藏
    decollect() {
      this.$http
        .post("/topic_collect/de_collect", {
          accesstoken: this.$store.state.accesstoken,
          topic_id: this.topic_id
        })
        .then(resp => {
          if (resp.data && resp.data.success) {
            this.topic.is_collect = false;
          }
        });
    }
  }
};
</script>

<style lang="less">
.topic {
  word-break: break-word;
}
.markdown-body {
  border-bottom: 1px solid #e0e0e0;
}
.topic-title {
  margin-bottom: 20px;
  padding: 5px;
  font-size: 18px;
  background: #f0f0f0;
  border-radius: 6px;
}
.topic-msg {
  margin-bottom: 30px;
  display: flex;
  font-size: 13px;
  line-height: 20px;
  justify-content: space-between;
  .left {
    display: flex;
    img {
      margin-right: 5px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .right {
    .tag {
      background: rgb(75, 173, 218);
      color: #fff;
      text-align: center;
      border-radius: 5px;
    }
  }
}
.reply_count {
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  b {
    color: rgb(75, 218, 137);
  }
}
</style>

