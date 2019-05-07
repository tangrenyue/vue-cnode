<template>
  <div>
    <h6>ceui</h6>
    <actionsheet v-model="show" :menus="menus" show-cancel></actionsheet>
  </div>
</template>

<script>
import { Actionsheet } from "vux";
export default {
  components: {
    Actionsheet
  },
  data: function() {
    return {
      show: true,
      menus: {
        menu1: "1",
        menu2: "2"
      }
    };
  }
};
</script>

<style scoped>
</style>