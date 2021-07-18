<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]" :ref="'label'">
      <label class="col-form-label wx-label">{{label}}</label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <!-- <div class=""> -->
        <slot v-bind:value="inputVal"></slot>
      <!-- </div> -->
      <b-form-invalid-feedback :state="internalState" v-html="invalidInternalText"></b-form-invalid-feedback>
      <b-form-valid-feedback :state="internalState" v-html="validInternalText"></b-form-valid-feedback>
    </div>
  </b-row>
</template>

<script>
import Layout from "./mixin/Layout";
import Validation from "./mixin/Validation";

export default {
  name: "wx-textfield",
  mixins: [Validation, Layout],
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
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: "text"
    },
    // state: {
    //   type: String,
    //   default: null
    // },
    prefix: {
      type: String
    },
    sufix: {
      type: String
    },
    slotPrefixSufix: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    inputVal(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    value(val) {
      // console.log(val);
      this.inputVal = val;
    }
  },
  methods: {
    // onFocus(event) {
    //   this.$emit("focus", event);
    // },
    // onInputClick(event) {
    //   // console.log("xxx")
    //   this.$emit("inputclick", this, this.$refs.input, event);
    //   // this.$emit("inputxclick", this, this.$refs.input, event);
    // }
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
