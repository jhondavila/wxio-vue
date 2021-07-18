<template>
  <div class="wx-labeleditable">
    <div v-if="!editing" @dblclick="editItem()">
      <slot>
        <div v-html="inputVal"></div>
      </slot>
    </div>

    <b-form-input
      v-model="renameNewLabel"
      placeholder
      v-if="editing"
      v-focus
      v-select-text
      @blur.native="endRenaming"
      @keyup.native.esc.stop="cancelEdit"
      @keyup.native.enter.stop="confirmEdit"
    ></b-form-input>
  </div>
</template>
<script>
export default {
  directives: {
    focus: {
      // directive definition
      inserted(el) {
        el.focus();
      }
    },
    selectText: {
      inserted(el) {
        el.select();
      }
    }
  },
  data() {
    return {
      editing: false,
      inputVal: this.value,
      renameNewLabel: null
    };
  },
  props: {
    value: {
      type: String | Number,
      default: null
    }
  },
  methods: {
    editItem() {
      this.renameNewLabel = this.inputVal;
      this.editing = true;
    },
    cancelEdit() {
      this.editing = false;
    },
    confirmEdit() {
      this.inputVal = this.renameNewLabel;
      this.editing = false;
    },
    endRenaming() {
      // console.log("endRenaming");
      this.editing = false;
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
  }
};
</script>

