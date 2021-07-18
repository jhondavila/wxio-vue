<template>
  <b-row class="my-2">
    
    <div :class="[$labelCls,clsLabel]" :ref="'label'">
      <label class="col-form-label wx-label">{{label}}</label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <!-- Render input with prefix and sufix supported-->
      <template v-if="prefix || sufix || slotPrefixSufix">
        <b-input-group size="md" :prepend="prefix" :append="sufix" v-if="slotPrefixSufix">
          <b-input-group-prepend>
            <slot name="prefix"></slot>
          </b-input-group-prepend>
          <b-form-input
            :class="['wx-input-value']"
            :ref="'input'"
            :readonly="readOnly ? true : false"
            :type="inputType"
            :placeholder="placeholder"
            :state="internalState"
            v-model="inputVal"
            @focus.native="onFocus($event)"
            @click.native="onInputClick($event)"
          ></b-form-input>
          <b-input-group-append>
            <slot name="sufix"></slot>
          </b-input-group-append>
        </b-input-group>
      </template>
      <!-- Render simple input-->
      <template v-else>
        <b-form-input
          :class="['wx-input-value']"
          :ref="'input'"
          :readonly="readOnly ? true : false"
          :type="inputType"
          :placeholder="placeholder"
          :state="internalState"
          v-model="inputVal"
          @focus.native="onFocus($event)"
          @click.native="onInputClick($event)"
        ></b-form-input>
      </template>
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

<style lang="scss" scoped>
.wx-two-points {
  position: absolute;
  top: 0%;
  right: 0%;
}
</style>
