<template>
  <div class="notify">
    <template v-for="(item) in items">
      <b-alert
        :show="item.count"
        :dismissible="item.closable"
        fade
        :variant="item.variant"
        :key="item.id"
        @dismissed="removeElement(item)"
        @dismiss-count-down="countDownChanged"
      >
        <div v-html="item.text"></div>
      </b-alert>
    </template>
  </div>
</template>
<script>
import Core from "../core";
import Vue from "vue";
export default {
  name: "wx-notification",

  data() {
    return {
      countId: -1,
      timevisible: 5,
      items: [],
      map: {}
    };
  },
  methods: {
    countDownChanged(val) {
      console.log(val);
    },
    removeElement(item) {
      item.count = 0;
      delete this.map[item.id];
      Core.Array.remove(this.items, item);
    },
    add(message, variant) {
      let opts = {
        text: "",
        variant: variant || "success",
        id: this.countId++,
        count: this.timevisible,
        closable: true
      };
      if (Core.isString(message)) {
        opts.text = message;
      } else {
        Core.apply(opts, message);
      }

      if (this.map[opts.id]) {
        // console.log(this.map[opts.id].count);
        Vue.set(this.map[opts.id], "count", opts.count);
        // this.map[opts.id].count = opts.count;
        // console.log(this.map[opts.id].count);
        // Core.apply(this.map[opts.id], opts);
      } else {
        this.map[opts.id] = opts;
        this.items.push(opts);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.notify {
  position: absolute;
  top: 50px;
  right: 8px;
  z-index: 99999999999;
}

</style>

<style lang="scss">
.alert-dismissible .close {
  height: 100%;
}
</style>