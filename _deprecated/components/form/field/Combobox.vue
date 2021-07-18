<template>
  <b-row class="my-2 wx-combobox" :class="[$wrapperCls]">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label">{{label}}</label>
    </div>
    <div :class="[$inputCls,clsInput]">
      <b-form-select
        v-model="inputVal"
        :options="options"
        :value-field="valueField"
        :text-field="displayField"
        :disabled-field="disabledField"
        :state="internalState"
      >
        <template v-if="placeholder">
          <option :value="null" disabled>{{placeholder}}</option>
        </template>
        <slot></slot>
      </b-form-select>
      <b-form-invalid-feedback :state="internalState" v-html="invalidInternalText"></b-form-invalid-feedback>
      <b-form-valid-feedback :state="internalState" v-html="validInternalText"></b-form-valid-feedback>
    </div>
  </b-row>
</template>

<script>
import Layout from "./mixin/Layout";
import Validation from "./mixin/Validation";
import Core from "../../../core";

export default {
  name: "wx-combobox",
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
      type: String | Number | Array,
      default: null
    },
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    valueField: {
      type: String,
      default: "id"
    },
    displayField: {
      type: String,
      default: "text"
    },
    disabledField: {
      type: String,
      default: "disabled"
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
.custom-select {
  background: none;
}
option:disabled {
  background-color: rgba(210, 210, 210, 0.6);
}
</style>

<style>
option:disabled {
  background-color: rgba(210, 210, 210, 0.6);
}
</style>

