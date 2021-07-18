<template>
  <i :class="[mode,'space','fa-'+icon, loading && 'fa-spin']" @click="onClick"></i>
</template>

<script>
export default {
  name: "wx-fa-icon",
  props: {
    icon: {
      type: String
    },
    mode: {
      type: String,
      default: "fas"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    }
  }
};
</script>
<style lang="scss" scoped>
.space {
  padding-right: 4px;
  padding-left: 4px;
}
</style>
