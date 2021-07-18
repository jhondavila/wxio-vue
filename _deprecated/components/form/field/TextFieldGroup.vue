<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]" :ref="'label'">
      <label class="col-form-label wx-label">{{label}}</label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <b-input-group size="md" :prepend="prefix" :append="sufix">
        <b-form-input
          :class="['wx-input-value']"
          :ref="'input'"
          :readonly="readOnly ? true : false"
          type="text"
          :placeholder="placeholder"
          v-model="inputVal"
          @focus.native="onFocus($event)"
          @click.native="onInputClick($event)"
        ></b-form-input>
      </b-input-group>
    </div>
  </b-row>
</template>

<script>
import Layout from "./mixin/Layout";

export default {
  name: "wx-textfield-group",
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
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String
    },
    sufix: {
      type: String
    }
  },
  watch: {
    inputVal(val) {
      this.$emit("input", val);
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

<style lang="scss" scoped>
.wx-two-points {
  position: absolute;
  top: 0%;
  right: 0%;
}
</style>
