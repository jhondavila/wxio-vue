<template>
  <div class="mask" v-if="mask">
    <div class="lds-dual-ring"></div>
    <div class="mask-message">{{message}}</div>
    <!-- <fa-icon icon="spinner" size="6x" spin ></fa-icon> -->
  </div>
</template>

<script>
export default {
  name: "wx-mask-dualring",
  props: {
    mask: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: "Cargando..."
    }
  }
};
</script>

<style lang="scss">
.mask {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;

  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.lds-dual-ring {
  display: inline-block;
  width: 50px;
  height: 50px;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  border-radius: 50%;
  border: double white grey;
  border-style: solid;
  border-width: 4px;
  border-color: #1d3768 transparent #1d3768 transparent;
  animation: lds-dual-ring 1s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
