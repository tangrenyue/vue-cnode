import Vue from "vue";
import Router from "vue-router";
import TopicList from "@/components/TopicList.vue"
import Topic from "@/components/Topic.vue"
import Login from "@/components/Login.vue"
import Logout from "@/components/Logout.vue"
import Msg from "@/components/Msg.vue"
import Center from "@/components/Center.vue"
import User from "@/components/User.vue"
import Create from "@/components/Create.vue"

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: '/topiclist/all'
  },
  {
    path: "/topiclist/:name",
    name: "topiclist",
    component: TopicList,
    props:true
  },
  {
    path: "/topic/:id",
    name: "topic",
    component: Topic,
    props:true
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/msg",
    name: "msg",
    component: Msg
  },
  {
    path: "/center",
    name: "center",
    component: Center
  },
  {
    path: '/user/:loginname',
    name: 'user',
    component: User,props:true
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout
  },
  {
    path: "/create",
    name: "create",
    component: Create
  }
];

const router = new Router({
  routes
});

export default router;
