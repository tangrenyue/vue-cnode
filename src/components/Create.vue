<template>
  <div>
    <h5>发表新话题</h5>

    <group>
      <x-textarea :max="20" :placeholder="标题" :rows="1" v-model="title"></x-textarea>
      <x-textarea :max="1000" :placeholder="内容" :rows="8" v-model="content"></x-textarea>
      <x-button type="primary" @click.native="addTopic">发表新话题</x-button>
    </group>
  </div>
</template>

<script>
import { XTextarea, Group, XButton } from "vux";
export default {
  components: {
    XTextarea,
    Group,
    XButton
  },
  data() {
    return {
      tab: "",
      title: "",
      content: ""
    };
  },
  methods: {
    addTopic() {
      this.$http
        .post("/topics", {
          accesstoken: this.$$store.state.accessToken,
          title: this.title,
          tab: "dev",
          content: this.content
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
  }
};
</script>

<style>
</style>
