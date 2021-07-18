<template>
  <b-card
    :header="title"
    :sub-title="subTitle"
    :class="[
    {
      'no-border': !border,
      'no-paddingBody': !paddingBody
    },
    'wx-form-panel'
  ]"
  >
    <b-form>
      <slot name="default"></slot>
    </b-form>
    <div class="text-right">
      <slot name="buttons"></slot>
    </div>
  </b-card>
</template>
<script>
export default {
  name: "wx-form",
  props: {
    title: {
      type: String,
      default: null
    },
    subTitle: {
      type: String,
      default: null
    },
    border: {
      type: Boolean,
      default: true
    },
    paddingBody: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    isValid() {
      return this._nestedValidate(this.$children);
    },
    clearInvalid() {
      this._nestedExecFn(this.$children, "clearInvalid");
    },
    clearValidation() {
      this._nestedExecFn(this.$children, "clearValidation");
    },
    _nestedExecFn(childrens, fn) {
      for (let x = 0; x < childrens.length; x++) {
        if (childrens[x][fn]) {
          childrens[x][fn]();
        } else if (childrens[x].$children) {
          this._nestedExecFn(childrens[x].$children, fn);
        }
      }
    },
    _nestedValidate(childrens) {
      let allValid = true;
      for (let x = 0; x < childrens.length; x++) {
        if (childrens[x].isValid) {
          if (!childrens[x].isValid()) {
            allValid = false;
          }
        } else if (
          childrens[x].$children &&
          !this._nestedValidate(childrens[x].$children)
        ) {
          allValid = false;
        }
      }
      return allValid;
    }
  }
};
</script>

