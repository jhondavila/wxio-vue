<template>
  <WxVideo
    :src="src"
    :ref="'screensave'"
    class="screensave"
    :volume="false"
    @click="onClick"
    @ended="onEnded"
  ></WxVideo>
</template>
<script>
import WxVideo from "./Video";
// import Vue from "vue";
// import IPC from "@/IPC";
export default {
  props: {
    src: {
      type: String,
      default: null
    },
    timeout: {
      type: Number,
      default: 60
    }
  },
  components: {
    WxVideo
  },
  data() {
    return {
      intervalMemory: null,
      contTimeOut: 0
    };
  },
  methods: {
    onEnded() {
      this.$refs.screensave.play();
    },
    onClick() {
      this.contTimeOut = 0;
      this.hide();
    },
    show() {
      // if()
      let el = this.$refs.screensave.$el;
      if (el.classList.contains("display-screensave")) {
        // console.log("contiene display-screensave");
      } else {
        el.classList.add("display-screensave");
        this.$refs.screensave.play();
        this.$emit("show");
      }
    },
    hide() {
      let el = this.$refs.screensave.$el;
      if (el.classList.contains("display-screensave")) {
        this.$refs.screensave.$el.classList.remove("display-screensave");
        this.$refs.screensave.pause();
        this.$emit("hide");
      } else {
        // console.log("no contiene display-screensave ");
      }
    },
    resetCount() {
      this.contTimeOut = 0;
      this.hide();
    }
  },
  mounted() {
    document.addEventListener("click", this.resetCount);
    document.addEventListener("touchstart", this.resetCount);
    this.intervalMemory = setInterval(() => {
      this.contTimeOut++;
      console.log(this.contTimeOut, this.timeout);
      if (this.contTimeOut > this.timeout) {
        this.contTimeOut = 0;
        this.show();
      }
    }, 1000);
    this.show();
  },
  destroyed() {
    clearInterval(this.intervalMemory);
    document.removeEventListener("click", this.resetCount);
    document.removeEventListener("touchstart", this.resetCount);
  }
};
</script>

<style lang="scss" scoped>
.screensave {
  position: fixed !important;
  width: 100%;
  height: 100%;
  z-index: 99999;
  visibility: hidden;
}

.display-screensave {
  visibility: visible;
}
</style>
