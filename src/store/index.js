import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'

Vue.use(Vuex)

const store = new Vuex.Store({
      state: {
        topics: [{
            name: "all",
            desc: "全部"
          },
          {
            name: "good",
            desc: "精华"
          },
          {
            name: "share",
            desc: "分享"
          },
          {
            name: "ask",
            desc: "问答"
          },
          {
            name: "job",
            desc: "招聘"
          },
          {
            name: "dev",
            desc: "测试"
          }
        ],
        unLoginedMoreMenus: {
          login: "登录"
        },
        loginedMoreMenus: {
          created:'发表新话题',
          center: '个人中心',
          msg: '消息通知',
          logout: '登出'

        },
        isShowMoreMenus: false,
        isLogined: false,
        loginname: '',
        accessToken: ''
      },
      getters: {
        moreMenus: function (state) {
          if (state.isLogined) {
            return state.loginedMoreMenus;
          }
          return state.unLoginedMoreMenus;
        },
        getTopicDescByTab: function (state) {

          // 返回一个函数结构
          return function (tab) {

            for (var index = 0; index < state.topics.length;

              index++) {

              if (state.Topics[index].name == tab) {

                return state.topics[index].desc;
              }
            }

          }
        }
      },
      mutations,
      actions
});

    export default store;
