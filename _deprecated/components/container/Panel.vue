<template>
  <!-- <div></div> -->
  <b-card
    :header="title"
    :sub-title="subTitle"
    :bg-variant="bgVariant"
    :class="{
        'wx-panel' : true,
        'no-border': !border,
        'no-paddingBody': !paddingBody
    }"
  >
    <!-- <template slot="header"> -->
    <slot name="header" slot="header"></slot>
    <!-- </template> -->
    <slot name="mask">
      <DualRing :mask="mask" :message="maskMessage"/>
    </slot>

    <slot></slot>
  </b-card>
</template>

<script>
import DualRing from "../loading/DualRing";

export default {
  name: "wx-panel",
  components: {
    DualRing
  },
  props: {
    title: {
      type: String,
      default: null
    },
    subTitle: {
      type: String,
      default: null
    },
    mask: {
      type: Boolean,
      default: false
    },
    maskMessage: {
      type: String,
      default: "Cargando..."
    },
    border: {
      type: Boolean,
      default: true
    },
    paddingBody: {
      type: Boolean,
      default: true
    },
    bgVariant: {
      type: String,
      default: "default"
    }
  }
};
</script>

<style lang="scss">
.no-border {
  border: 0px !important;
}

.no-paddingBody {
  .card-body {
    padding: 0px;
  }
}
</style>
