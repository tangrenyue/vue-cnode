<template>
  <div>logout</div>
</template>

<script>
export default {
  name: "logout",
  created: function() {
    this.$$store.commit("mutationsLogout");
    window.localStorage.clear();
    this.$router.push("/topiclist/all");
  }
};
</script>

<style>
</style>
