<template>
  <div>
    <tab>
      <tab-item
        v-for="(item,index) in topics"
        :key="index"
        :selected="$route.path =='/topiclist/' + item.name"
        @on-item-click="routeto(index)"
      >{{item.desc}}</tab-item>
    </tab>
    <scroller
      height="-46"
      lock-x
      scrollbarY
      use-pullup
      :pullup-config="pullupConfig"
      @on-pullup-loading="loadMoreData"
      ref="pullup"
    >
      <div>
        <group>
          <cell
            title="cell"
            v-for="(item, index) in lists"
            :key="index"
            is-link
            :link="'/topic/'+ item.id"
          >
            <span slot="title" class="cell_title">
              <span class="reply_count">{{ item.reply_count }}</span>
              <span class="visit_count">{{ item.visit_count }}</span>
              <span v-if="item.top" class="top">置顶</span>
              <span class="tab" v-if="$route.path =='/topiclist/all'">{{ getDescByTab(item.tab)}}</span>
              <span class="title">{{ item.title }}</span>
            </span>
            <span slot="icon" class="author_avatar">
              <img :src="item.author.avatar_url">
            </span>
          </cell>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Cell, Group, Scroller, Tab, TabItem } from "vux";
import { mapState } from "vuex";
export default {
  name: "topiclist",
  props: ["name"],
  components: {
    Cell,
    Group,
    Scroller,
    Tab,
    TabItem
  },
  computed: {
    ...mapState(["topics"])
  },
  data: function() {
    return {
      lists: [],
      page: 1,
      limit: 15,
      pullupConfig: {
        content: "上拉加载更多",
        downContent: "松开进行加载",
        upContent: "上拉加载更多",
        loadingContent: "加载中..."
      }
    };
  },
  methods: {
    getDescByTab(tab){
      return  this.$store.getters.getTopicDescByTab(tab)
    }
    routeto(index) {
      this.$router.push("/topiclist/" + this.topics[index].name);
    },
    loadMoreData() {
      var that = this;
      this.page += 1;
      this.$http
        .get("/topics", {
          params: { tab: this.name, page: this.page, limit: this.limit }
        })
        .then(function(response) {
          if (response.data.success) {
            for (let i = 0; i < response.data.data.length; i++) {
              that.lists.push(response.data.data[i]);
            }
            that.$refs.pullup.donePullup();
          }
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.$http
        .get("/topics", {
          params: {
            tab: to.params.name,
            page: vm.page,
            limit: vm.limit
          }
        })
        .then(function(response) {
          if (response.data.success) {
            vm.lists = response.data.data;
          }
        });
    });
  },

  beforeRouteUpdate(to, from, next) {
    var that = this;
    this.$http
      .get("/topics", {
        params: { tab: to.params.name, page: this.page, limit: this.limit }
      })
      .then(function(response) {
        if (response.data.success) {
          that.lists = response.data.data;
        }
      });
    next();
  }
};
</script>

<style scoped>
.cell_title {
  font-size: 0.8em;
}
.cell_title .reply_count {
  color: #9e78c0;
}
.cell_title .visit_count {
  color: #b4b4b4;
}
.cell_title .top {
  background: #80bd01;
  padding: 2px 4px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
}
.cell_title .tab {
  background-color: #e5e5e5;
  color: #999;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
}
.author_avatar img {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  margin-right: 5px;
}
</style>