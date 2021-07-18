<template>
    <b-row  class="my-2">
        <div :class="[$labelCls,clsLabel]">
            <label class="col-form-label wx-label">{{label}}</label>
        </div>
        <div :class="[$inputCls,clsInput,'align-self-center']">
            <b-form-radio-group v-model="inputVal">
                <slot name="default"></slot>
            </b-form-radio-group>
        </div>
        <!-- <b-col sm="10" class="col-form-label">
        
        </b-col> -->
    </b-row>
</template>
<script>
import Layout from "./mixin/Layout";

export default {
  name: "wx-radiogroup",
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
      type: String | Number,
      default: null
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

