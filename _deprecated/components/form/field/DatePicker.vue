<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]" :ref="'label'">
      <label class="col-form-label wx-label">{{label}}</label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <Datepicker
        :language="language"
        :input-class="'wx-datepicker-input'"
        :bootstrap-styling="true"
        :format="format"
        v-model="inputVal"
      ></Datepicker>
    </div>
  </b-row>
</template>

<script>
import Layout from "./mixin/Layout";
import Datepicker from "vuejs-datepicker";
import { es } from "vuejs-datepicker/dist/locale";

export default {
  name: "wx-datepicker",
  mixins: [Layout],
  components: {
    Datepicker
  },
  data() {
    return {
      inputVal: this.value,
      language: es
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
      default: "dd/MM/yyyy"
    }
    // readOnly: {
    //   type: Boolean,
    //   default: false
    // },
    // inputType: {
    //   type: String,
    //   default: "text"
    // },
    // state: {
    //   type: String,
    //   default: null
    // },
    // prefix: {
    //   type: String
    // },
    // sufix: {
    //   type: String
    // },
    // slotPrefixSufix: {
    //   type: Boolean,
    //   default: false
    // }
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
      // console.log("xxx")
      this.$emit("inputclick", this, this.$refs.input, event);
      // this.$emit("inputxclick", this, this.$refs.input, event);
    }
  }
};
</script>

<style lang="scss" >
.wx-datepicker-input[readonly] {
  background-color: #ffffff !important;
  opacity: 1;
}
</style>
