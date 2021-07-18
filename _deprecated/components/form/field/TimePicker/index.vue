<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]" :ref="'label'">
      <label class="col-form-label wx-label">{{label}}</label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <VueTimepicker
        :class="'wx-timepicker-input'"
        :format="format"
        v-model="inputVal"
        :hideClearButton="hideClearButton"
      />
    </div>
  </b-row>
</template>

<script>
import Layout from "./../mixin/Layout";
import VueTimepicker from "./vue-timepicker";
// import Datepicker from "vuejs-datepicker";
// import { es } from "vuejs-datepicker/dist/locale";

export default {
  name: "wx-datepicker",
  mixins: [Layout],
  components: {
    VueTimepicker
  },
  data() {
    return {
      inputVal: this.value
      //   language: es
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
    format: {
      type: String,
      default: "hh:mm a"
    },
    hideClearButton: {
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
    onFocus(event) {
      this.$emit("focus", event);
    },
    onInputClick(event) {
      this.$emit("inputclick", this, this.$refs.input, event);
    }
  }
};
</script>

<style lang="scss" >
.wx-timepicker-input {
  input[readonly] {
    background-color: #ffffff !important;
    opacity: 1;
  }
}
</style>
