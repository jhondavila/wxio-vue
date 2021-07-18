<script>
import { mixins, scrollBarWidth as getSbw } from "./utils";
import WxHeader from "./WXHeader";
import WXBody from "./WXBody";
import WXFilter from "./WXFilter";
import WxColumns from "./columns";
import Core from "../../core";
import * as _ from "lodash";
import { setTimeout } from "timers";

import DualRing from "../loading/DualRing";

// console.log(Columns);
export default {
  components: {
    WxHeader,
    WXBody
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    prefixCls: {
      type: String,
      default: "wx-table"
    },
    height: {
      type: String | Number,
      default: "auto"
    },
    emptyText: {
      type: String | Number,
      default: "Sin datos"
    },
    dataIndexProperty: {
      type: String | Number,
      default: "key"
    },
    titleProperty: {
      type: String | Number,
      default: "label"
    },
    externalBorder: {
      type: Boolean,
      default: true
    },
    sorterStyle: {
      type: String,
      default: "column"
    },
    mask: {
      type: Boolean
    },
    maskMessage: {
      type: String
    }
  },
  render() {
    return (
      <div ref="table" class={[this.prefixCls, this.tableWrapper]}>
        {this.$slots.mask ? (
          this.$slots.mask
        ) : (
          <DualRing mask={this.mask} message={this.maskMessage} />
        )}

        <div ref="header-wrapper" class={`${this.prefixCls}-header-wrapper`}>
          <WxHeader
            ref="table-header"
            columns={this.tableColumns}
            prefixCls={this.prefixCls}
            class={this.tableClass}
            titleProperty={this.titleProperty}
            dataIndexProperty={this.dataIndexProperty}
            hasVerticalScroll={this.hasVerticalScroll}
            onSorter={this.onSorter.bind(this)}
            onRemoveSorter={this.onRemoveSorter.bind(this)}
            sorters={this.intSorters}
            sorterStyle={this.sorterStyle}
          />
        </div>

        {this.initLayoutReady && (
          <div
            ref="body-wrapper"
            style={this.bodyWrapperStyle}
            class={`${this.prefixCls}-body-wrapper`}
            onScroll={this.onScrollerBody}
          >
            <WXBody
              ref="table-body"
              prefixCls={this.prefixCls}
              columns={this.tableColumns}
              data={this.processData}
              emptyText={this.emptyText}
              class={this.tableClass}
              tableScoped={this.$scopedSlots}
              dataIndexProperty={this.dataIndexProperty}
              onDataChange={this.onDataChange}
            />
          </div>
        )}
      </div>
    );
  },
  computed: {
    tableWrapper() {
      return {
        "position-relative": true,
        "wx-table-ext-border": this.externalBorder
      };
    },
    tableClass() {
      return {
        table: true,
        "table-striped": this.striped,
        "table-bordered": this.bordered,
        "table-hover": true,
        "table-sm": true
      };
    },
    bodyWrapperStyle() {
      return {
        height: this.bodyHeight
      };
    },
    processData() {
      let propertys = [];
      let directions = [];
      for (let x = 0; x < this.intSorters.length; x++) {
        let item = this.intSorters[x];
        propertys.push(item.fn || item.property);
        directions.push(item.direction ? item.direction.toLowerCase() : "asc");
      }
      let data = _.orderBy(this.data, propertys, directions);

      // console.log(data);

      return data;
      // Vue.set(this, "data", data);
    }
  },
  data() {
    let bufferResize = Core.Function.createBuffered(() => {
      this.measure();
    }, 100);

    let bufferDataChange = Core.Function.createBuffered(() => {
      this.calculateHeight();
      this.calculateScrollSize();
    }, 100);

    // console.log(this.columns)

    return {
      computedWidth: "",
      computedHeight: "",
      tableColumns: [],
      bodyHeight: "auto",
      hasVerticalScroll: false,
      ctColumns: [],
      bufferResize: bufferResize,
      intSorters: [],
      bufferDataChange: bufferDataChange,
      initLayoutReady: false,
      rendered: false
    };
  },
  watch: {
    // $props: {
    //   deep: true,
    //   handler(v) {
    //     console.log("props changer");
    //     console.log(v);
    //     // Object.assign(this.$data, initialState(this, this.expandKey));
    //   }
    // }
  },
  mounted() {
    //   this.initialColumns();
    // this.measure();
    this.ctColumns = this.formatColumns();
    this.tableColumns = this.calcSizeColumns();

    this.$nextTick(() => {
      this.initLayoutReady = true;
      this.$nextTick(() => {
        this.calculateHeight();
        this.$nextTick(() => {
          this.rendered = true;
          this.calculateScrollSize();
        });
      });
    });

    window.addEventListener("resize", this.onResizeBrowser);
    // debugger
    // this.calculateScrollSize();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeBrowser);
  },

  methods: {
    onResizeBrowser() {
      // debugger
      // console.log(this.initLayoutReady)
      // console.log(this.rendered)
      if (this.rendered) {
        this.bufferResize();
      }
    },
    formatColumns() {
      return this.columns.map(col => {
        let ctCol;
        if (col.type && WxColumns[col.type.toLowerCase()]) {
          ctCol = new WxColumns[col.type](col);
          // ctCol.renderer = this.$scopedSlots[col[this.dataIndexProperty]];
          return ctCol;
        } else {
          ctCol = new WxColumns["default"](col);
          // ctCol.renderer = this.$scopedSlots[col[this.dataIndexProperty]];
          return ctCol;
        }
      });
    },
    calcSizeColumns() {
      const { clientWidth } = this.$el;

      let columnsWidth = 0;
      const minWidthColumns = [];
      const otherColumns = [];
      const columns = this.ctColumns;

      columns.forEach((column, index) => {
        let width = "";
        let minWidth = "";
        if (!column.width) {
          if (column.minWidth) {
            minWidth =
              typeof column.minWidth === "number"
                ? column.minWidth
                : parseInt(column.minWidth, 10);
          } else {
            minWidth = 80;
          }

          Object.assign(column, {
            minWidth,
            _index: index
          });
          minWidthColumns.push(column);
        } else {
          width =
            typeof column.width === "number"
              ? column.width
              : parseInt(column.width, 10);

          Object.assign(column, {
            minWidth,
            _index: index
          });

          otherColumns.push(column);
        }
        columnsWidth += minWidth || width;
      });
      const scrollBarWidth = getSbw();
      const totalWidth = columnsWidth + scrollBarWidth;
      const isScrollX = totalWidth > clientWidth;

      if (!isScrollX) {
        const extraWidth = clientWidth - totalWidth;
        const averageExtraWidth = Math.floor(
          extraWidth / minWidthColumns.length
        );
        minWidthColumns.forEach(column => {
          column.computedWidth = column.minWidth + averageExtraWidth;
        });
      }
      const tableColumns = otherColumns.concat(minWidthColumns);
      tableColumns.sort((a, b) => a._index - b._index);

      return tableColumns;
    },

    calculateHeight() {
      // debugger
      const { clientWidth, clientHeight } = this.$el;
      this.computedWidth = clientWidth + 2;
      this.computedHeight = clientHeight + 2;
      // debugger;
      this.bodyHeight = `auto`;

      if (this.height === "auto") {
        this.bodyHeight = `auto`;
      } else if (this.height === "fill") {
        let height = Number(
          window.getComputedStyle(this.$el).height.replace(/px/, "")
        ).valueOf();
        let headerHeight = Core.getComputedHeight(this.$refs["header-wrapper"]);
        this.bodyHeight = `${height - headerHeight - 2}px`;
      } else {
        let maxHeight = parseInt(this.height, 10);
        let headerHeight = Core.getComputedHeight(this.$refs["header-wrapper"]);
        if (this.computedHeight > maxHeight) {
          this.bodyHeight = `${maxHeight - headerHeight}px`;
        }
      }
      console.log("calculateHeight", this.bodyHeight);
    },

    measure() {
      this.tableColumns = this.calcSizeColumns(this);
      this.$nextTick(() => {
        this.calculateHeight();
        this.$nextTick(() => {
          this.calculateScrollSize();
        });
      });
    },

    onDataChange() {
      this.bufferDataChange();
    },

    calculateScrollSize() {
      let body = this.$refs["body-wrapper"];

      const scrollBarWidth = getSbw();
      if (body.offsetWidth - body.clientWidth >= scrollBarWidth) {
        this.hasVerticalScroll = true;
      } else {
        this.hasVerticalScroll = false;
      }
    },

    onScrollerBody($event) {
      this.$refs["header-wrapper"].scrollLeft = $event.target.scrollLeft;
      this.calculateScrollSize();
    },

    onRemoveSorter(column) {
      console.log("onRemoveSorter");
      let sorter = this.intSorters.find(i => {
        return i.property === column[this.dataIndexProperty];
      });
      Core.Array.remove(this.intSorters, sorter);
    },
    onSorter(column, direction) {
      let sorter = this.intSorters.find(i => {
        return i.property === column[this.dataIndexProperty];
      });
      // console.log(sorter);

      if (!sorter || sorter.direction !== direction) {
        Core.Array.remove(this.intSorters, sorter);
        this.intSorters.push({
          property: column[this.dataIndexProperty],
          direction: direction
        });
      } else {
        Core.Array.remove(this.intSorters, sorter);
      }
    }
  }
};
</script>
<style lang="scss">
.wx-table {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.wx-table-header-wrapper {
  overflow: hidden;
}

.wx-table-body-wrapper {
  overflow: auto;
  // max-height: 198px;
}

.wx-table-ext-border {
  border: 1px solid #dee2e6;

  .table-bordered {
    border: 0px;
    tr td:first-child {
      border-left: 0px;
    }

    tr td:last-child {
      border-right: 0px;
    }

    tbody :first-child td {
      border-top: 0px;
    }

    tbody :last-child td {
      // border-bottom: 0px;
    }
  }
}
</style>
