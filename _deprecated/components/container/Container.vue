
<script>
import DualRing from "../loading/DualRing";
export default {
  name: "wx-container",
  components: {
    DualRing
  },
  render() {
    return (
      <div class={["wx-container", this.layoutClass]}>
        {this.$slots.mask ? (
          this.$slots.mask
        ) : (
          <DualRing mask={this.mask} message={this.maskMessage} />
        )}
        {this.$slots.default}
      </div>
    );
  },
  props: {
    mask: {
      type: Boolean,
      default: false
    },
    maskMessage: {
      type: String,
      default: "Cargando..."
    },
    layout: {
      type: String,
      default: null
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    relative: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    layoutClass() {
      if (this.layout === "fill") {
        return {
          "flex-fill": true,
          "d-flex": true,
          "flex-column": true,
          scrollable: this.scrollable ? true : false,
          ...(this.scrollable && {
            "fix-height": true
          }),
          "position-relative": this.relative
        };
      } else {
        return {};
      }
    }
  }
};
</script>

<style lang="scss">
.scrollable {
  overflow: auto;
}

.fix-height {
  height: 0;
}
</style>
