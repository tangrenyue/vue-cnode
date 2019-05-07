<template></template>

<script>
export default {
  name: "center",
  computed: {
    loginname: function() {
      return this.$store.state.loginname;
    }
  },
  created() {
    this.$router.replace("/user/" + this.loginname);
  }
};
</script>

<style>
</style>
