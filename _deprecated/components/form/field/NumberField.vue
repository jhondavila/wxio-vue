<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label wx-label" v-html="label"></label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <template v-if="prefix || sufix || slotPrefixSufix">
        <b-input-group size="md" :prepend="prefix" :append="sufix" v-if="slotPrefixSufix">
          <b-input-group-prepend>
            <slot name="prefix"></slot>
          </b-input-group-prepend>
          <b-form-input
            :class="['wx-input-value']"
            :readonly="readOnly ? true : false"
            type="text"
            @keyup.native="onKeyup($event)"
            @keydown.native="onKeydown($event)"
            :placeholder="placeholder"
            @focus.native="onFocus($event)"
            v-model="inputVal"
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
          :readonly="readOnly ? true : false"
          type="text"
          @keypress.native="onKeyPress($event)"
          @keyup.native="onKeyup($event)"
          @keydown.native="onKeydown($event)"
          :placeholder="placeholder"
          @focus.native="onFocus($event)"
          v-model="inputVal"
        ></b-form-input>
      </template>
    </div>
  </b-row>
</template>

<script>
import Layout from "./mixin/Layout";

export default {
  name: "wx-numberfield",
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
    },
    slotPrefixSufix: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: Infinity
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
      
      // console.log("onFocus");
    },
    onKeyPress(e) {
      // console.log("onKeyPress");
    },
    onKeyup(e) {
      // let length = this.inputVal ? this.inputVal.length : 0;
      // if (length + 1 > this.maxLength) {
      //   e.preventDefault();
      // }
    },
    onKeydown(e) {
      // console.log(this.inputVal);

      // console.log(e);
      if (
        // backspace, delete, tab, escape, enter, dot
        [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) >= 0 ||
        // Ctrl/cmd+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Ctrl/cmd+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Ctrl/cmd+R
        (e.keyCode === 82 && (e.ctrlKey || e.metaKey)) ||
        // Ctrl/cmd+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }
      if (
        (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
        return;
      }

      // console.log(e);
      let length = this.inputVal ? this.inputVal.length : 0;
      if (length + 1 > this.maxLength) {
        e.preventDefault();
      }
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
