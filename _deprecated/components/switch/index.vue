<template lang="html">
  <div :class="switchClass" @click="toggle">
    <span :class="`${prefixCls}__inner`">
      <span v-if="value">{{textOn}}</span>
      <span v-if="!value">{{textOff}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "zk-switch",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    textOn: {
      type: String,
      default: "On"
    },
    textOff: {
      type: String,
      default: "Off"
    }
  },
  data() {
    return {
      prefixCls: "zk-switch"
    };
  },
  computed: {
    switchClass() {
      return [
        `${this.prefixCls}`,
        {
          [`${this.prefixCls}--checked`]: this.value,
          [`${this.prefixCls}--disabled`]: this.disabled
        }
      ];
    }
  },
  methods: {
    toggle() {
      if (this.disabled) {
        return false;
      }
      const value = !this.value;
      this.$emit("input", value);
      return this.$emit("change", value);
    }
  }
};
</script>

<style lang="less" src="./Switch.less"></style>