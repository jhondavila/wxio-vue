<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label">{{label}}</label>
    </div>
    <div :class="[$inputCls,clsInput,'align-self-center']">
      <b-form-checkbox v-model="inputVal"></b-form-checkbox>
    </div>
  </b-row>
</template>
<script>
import Layout from "./mixin/Layout";
export default {
  name: "wx-checkbox",
  mixins: [Layout],
  data() {
    return { inputVal: this.value };
  },
  props: {
    label: {
      type: String | Number,
      default: null
    },
    value: {
      type: Boolean | String,
      default: false
    },
    enabledValue: {
      type: Boolean | String | Array,
      default: () => {
        return ["1", true, "true", "on", 1];
      }
    },
    disabledValue: {
      type: Boolean | String | Array,
      default: () => {
        return ["0", false, "false", "off", 0];
      }
    }
  },
  watch: {
    inputVal(val) {
      // console.log("inputVal");
      // console.log(val);
      // console.log(this.value);
      // if (val) {
      this.$emit("input", val);
      this.$emit("change", val);
      // } else {
      // this.$emit("input", val);
      // }
    },
    value(val) {
      // console.log("value");
      if (this.enabledValue.indexOf(val) > -1) {
        this.inputVal = true;
      } else {
        this.inputVal = false;
      }
    }
  }
};
</script>
