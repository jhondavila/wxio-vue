<template>
<b-row class="my-2">
  <div :class="[$labelCls,clsLabel]">
    <label class="col-form-label wx-label">{{label}}</label>
    <div class="wx-label wx-two-points" v-if="twoPoint">:</div>
  </div>
  <div :class="[$inputCls,clsInput]">
    <label
      class="col-form-label wx-display-value"
      v-html="inputVal"
    ></label>
    <!-- <b-form-input
   type="text"
   :placeholder="placeholder"
   v-model="inputVal"
 ></b-form-input> -->
  </div>
</b-row>
</template>

<script>
import Layout from "./mixin/Layout";

export default {
  name: "wx-textfield",
  mixins: [Layout],
  data() {
    return {
      inputVal: this.value
    };
  },
  props: {
    label: {
      type: String | Number,
      default: null
    },
    placeholder: {
      type: String | Number,
      default: null
    },
    value: {
      type: String | Number,
      default: null
    },
    twoPoint: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    inputVal(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.inputVal = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.wx-two-points {
  position: absolute;
  top: 0%;
  right: 0%;
}
</style>
