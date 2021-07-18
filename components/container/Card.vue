<template>
  <div :class="[wrapperStyle]">
    <div :class="[bodyStyle]">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Core from "../../core";
import PathVal from "../../util/Path";
export default {
  // model: {
  //   prop: "activeIndex",
  //   event: "change"
  // },
  props: {
    fill: {
      type: Boolean,
      default: false
    },
    bodyDirection: {
      type: String,
      default: "column"
    },
    activeIndex: {
      type: Number | String,
      default() {
        return 0;
      }
    }
  },
  computed: {
    wrapperStyle() {
      if (this.fill === true) {
        return {
          "flex-fill": true,
          "d-flex": true
        };
      } else {
        return {
          "d-flex": true
        };
      }
    },
    bodyStyle() {
      if (this.fill === true) {
        return {
          "flex-fill": true,
          "d-flex": true,
          "col-24": true,
          "flex-column": this.bodyDirection ? true : false,
          "p-0": true
        };
      } else {
        return {
          "col-24": true,
          "p-0": true
        };
      }
    }
  },
  data() {
    return {
      localActiveIndex: null,
      activeItem: null
      // mapsRefs: {}
    };
  },
  watch: {
    $slots(value) {
      console.log(value);
    },
    localActiveIndex(value) {
      console.log("localActiveIndex", value);
      this.setActiveItem(value);
      this.$emit("update:activeIndex", value);
    },
    activeIndex(value) {
      this.localActiveIndex = value;
    }
  },
  mounted() {
    this.localActiveIndex = this.activeIndex;

    // return;

    let slots = this.$slots.default.filter(i => {
      return i.tag;
    });
    let i;
    let iActive;
    let attr;
    for (let x = 0; x < slots.length; x++) {
      i = slots[x];
      // if (i.data && i.data.ref) {
      //   this.mapsRefs[i.data.ref] = i;
      // }
      Core.addCls(i.elm, "disabled");
      if (i && i.data) {
        attr = i.data.attrs;

        if (attr && (attr.active === "" || attr.active)) {
          iActive = i;
        }
      }
    }

    // debugger
    let iActiveRef = PathVal.getValue("data.ref", iActive);
    if (iActiveRef) {
      this.localActiveIndex = iActiveRef;
    } else if (iActive) {
      this.localActiveIndex = slots.indexOf(iActive);
    } else {
      this.localActiveIndex = 0;
    }

    // if (this.mapsRefs[this.localActiveIndex]) {
    //   Core.removeCls(iActive.elm, "disabled");
    //   return;
    // }
    // if (iActive) {
    //   Core.removeCls(iActive.elm, "disabled");
    // } else if (slots[this.localActiveIndex]) {
    //   Core.removeCls(slots[0].elm, "disabled");
    // }
  },
  methods: {
    setActiveItem(item) {
      console.log("setActiveItem", item);
      this.$nextTick(() => {
        let slots = this.$slots.default.filter(i => {
          return i.tag;
        });

        // if (this.mapsRefs[item]) {
        //   Core.removeCls(this.mapsRefs[item].elm, "disabled");
        //   return;
        // }

        // debugger
        let i;
        for (let x = 0; x < slots.length; x++) {
          i = slots[x];
          let iActiveRef = PathVal.getValue("data.ref", i);
          if (item === x || iActiveRef === item) {
            Core.removeCls(i.elm, "disabled");
          } else {
            Core.addCls(i.elm, "disabled");
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.disabled {
  display: none !important;
}
</style>
