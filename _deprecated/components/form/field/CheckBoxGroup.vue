<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label wx-label">{{label}}</label>
    </div>
    <div :class="[$inputCls,clsInput,'align-self-center']">
      <!-- <b-form-radio-group v-model="inputVal">
        <slot name="default"></slot>
      </b-form-radio-group>-->
      <b-form-checkbox-group
        :stacked="stacked"
        class="checkboxgroup-input"
        v-model="inputVal"
        :name="name"
        :options="data"
        :value-field="valueField"
        :text-field="displayField"
      ></b-form-checkbox-group>
    </div>
    <!-- <b-col sm="10" class="col-form-label">
        
    </b-col>-->
  </b-row>
</template>
<script>
import Layout from "./mixin/Layout";

export default {
  name: "wx-checkboxgroup",
  mixins: [Layout],

  data() {
    return { inputVal: this.value };
  },
  props: {
    stacked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    label: {
      type: String | Number,
      default: null
    },
    value: {
      type: Array,
      default: null
    },
    data: {
      type: Array
    },
    valueField: {
      type: String,
      default: "id"
    },
    displayField: {
      type: String,
      default: "text"
    }
  },
  watch: {
    inputVal(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    value(val) {
      this.inputVal = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.checkboxgroup-input {
  margin-top: 0.5rem;
}
</style>

