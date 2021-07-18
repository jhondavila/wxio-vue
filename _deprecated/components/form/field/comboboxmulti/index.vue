<template>
  <b-row class="my-2 wx-combobox">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label">{{label}}</label>
    </div>
    <div :class="[$inputCls,clsInput]">
      <inputMultiSelect
        :options="options"
        :multiple="true"
        :closeOnSelect="false"
        v-model="inputVal"
        :label="displayField"
      />
    </div>
  </b-row>
</template>

<script>
import Layout from "../mixin/Layout";
import inputMultiSelect from "./Select";
export default {
  name: "wx-combobox",
  components: {
    inputMultiSelect
  },
  mixins: [Layout],
  //   model: {
  //     prop: "checked",
  //     event: "change"
  //   },
  data() {
    return { inputVal: this.value };
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
</style>
