<template>
  <div class="carousel-item">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "cardItem",
  props: {
    name: {
      type: String,
      default: null
    },
    itemRef: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.carousel-item {
  width: 100%;
  height: 100%;
}
</style>

