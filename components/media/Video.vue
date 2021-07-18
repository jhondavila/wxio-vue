<template>
  <div v-show="show" @click="onClick">
    <video :controls="controls" data-type="video" :ref="'video'" :class="['video']">
      <source :src="src" type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  name: "wx-video",
  props: {
    // show: {
    //   default: false
    // },
    // node: Object,
    controls: {
      default: false
    },
    src: {
      default: ""
    }
  },
  data() {
    var config = {
      show: true
    };
    var styles = {};
    config["styles"] = styles;
    return config;
  },
  mounted() {
    this.hookEvents();
  },
  watch: {
    show: function(value, oldValue) {}
  },
  updated() {},
  methods: {
    // getObjectFit() {
    //   return this.node.object_fit
    //     ? "obj-fit-" + this.node.object_fit
    //     : "obj-fit-fill";
    // },
    onClick() {
      this.$emit("click",this);
    },
    play() {
      var video = this.$refs.video;
      video.pause();
      video.currentTime = 0;
      var promise = video.play();
      if (promise !== undefined) {
        promise.then(_ => {}).catch(error => {console.log(error)});
      }
    },
    reset() {
      var video = this.$refs.video;
      if (video) {
        video.currentTime = 0;
      }
    },
    hookEvents() {
      // if (this.$refs.video) {
      this.$refs.video.addEventListener(
        "ended",
        function() {
          this.$emit("ended", this);
        }.bind(this),
        false
      );
    },
    pause() {
      var video = this.$refs.video;
      video.pause();
    }
  }
};
</script>

<style lang="scss" scoped>
.video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.obj-fit-fill {
  object-fit: fill;
}

.obj-fit-contain {
  object-fit: contain;
}
</style>