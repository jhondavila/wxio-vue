<template>
    <div id="dynamic-fade-demo" class="demo">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="msgVisible"><slot></slot></p>
  </transition>
</div>
</template>
<script>
import "velocity-animate";
export default {
  name : "label-status",
  props: {
    message: {
      default: ""
    },
    show: {
      default: true
    },
    fadeInDuration: {
      default: 700
    },
    fadeOutDuration: {
      default: 500
    }
  },
  data() {
    return {
      msgVisible: false
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.msgVisible = false;
      }
    }
  },
  mounted: function() {
    this.msgVisible = true;
  },
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0;
    },
    enter: function(el, done) {
      var vm = this;
      if (vm.show) {
        Velocity(
          el,
          { opacity: 1 },
          {
            duration: this.fadeInDuration,
            complete: function() {
              done();
              vm.msgVisible = false;
            }
          }
        );
      }
    },
    leave: function(el, done) {
      var vm = this;
      Velocity(
        el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function() {
            done();
            vm.msgVisible = true;
          }
        }
      );
    }
  }
};
</script>

