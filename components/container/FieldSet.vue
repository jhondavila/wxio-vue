<template>
  <fieldset class="wx-fieldset">
    <legend class="wx-fieldset-title">
      <slot name="title">
        <div class="title">{{title}}</div>
      </slot>
    </legend>
    <slot></slot>
  </fieldset>
</template>
<script>
export default {
  name: "wx-fieldset",
  props: {
    title: {
      type: String | Number
    }
  }
};
</script>
<style lang="scss" scoped>
fieldset.wx-fieldset {
  // border: 1px groove #ececec !important;
  padding: 0.8em 1em 1em 1em;
  margin: 0 0 0.5em 0;
  // -webkit-box-shadow: 0px 0px 0px 0px #ececec;
  // box-shadow: 0px 0px 0px 0px #ececec;
  background-clip: padding-box;
  border: 1px solid #e4e7ea;
  border-radius: 0.25rem;
  -webkit-transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}

legend.wx-fieldset-title {
  width: auto;
}
.title {
  font-size: 1rem;
  font-weight: 600 !important;
  text-align: left !important;
  padding: 0 10px;
  border-bottom: none;
}
</style>


