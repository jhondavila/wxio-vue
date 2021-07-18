<script>
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    prefixCls: {
      type: String
    },
    hasVerticalScroll: {
      type: Boolean,
      default: false
    },
    sorters: {
      type: Array,
      default() {
        return [];
      }
    },
    dataIndexProperty: {
      type: String,
      default: "key"
    },
    sorterStyle: {
      type: String,
      default: "icon"
    }
  },
  methods: {
    onHeaderColumnClick(column) {
      if (this.sorterStyle === "column") {
        let sorter = this.mapSorters[column[this.dataIndexProperty]];
        if (!sorter) {
          this.$emit("sorter", column, "asc");
        } else if (sorter === "asc") {
          this.$emit("sorter", column, "desc");
        } else if (sorter) {
          this.$emit("removeSorter", column);
        }
      }
    },
    sorter(column, direction) {
      let sorter = this.mapSorters[column[this.dataIndexProperty]];
      if (sorter && sorter === direction) {
        this.$emit("removeSorter", column);
      } else {
        this.$emit("sorter", column, direction);
      }
    },
    renderFilterIcon(column) {
      return (
        <div class={"d-flex flex-column sorter filter-icon"}>
          <fa-icon
            icon="caret-up"
            class={[
              "text-primary sorter-icon",
              this.mapSorters[column[this.dataIndexProperty]] === "asc" &&
                "active"
            ]}
            onClick={this.sorter.bind(this, column, "asc")}
          />
          <fa-icon
            icon="caret-down"
            class={[
              "text-info sorter-icon",
              this.mapSorters[column[this.dataIndexProperty]] === "desc" &&
                "active"
            ]}
            onClick={this.sorter.bind(this, column, "desc")}
          />
        </div>
      );
    },
    renderFilterColumn(column) {
      return (
        <div class={"d-flex flex-column sorter filter-column"}>
          {this.mapSorters[column[this.dataIndexProperty]] === "asc" && (
            <fa-icon
              icon="sort-amount-up"
              class={["text-primary sorter-icon"]}
            />
          )}

          {this.mapSorters[column[this.dataIndexProperty]] === "desc" && (
            <fa-icon
              icon="sort-amount-down"
              class={["text-primary sorter-icon"]}
            />
          )}
        </div>
      );
    }
  },
  computed: {
    mapSorters() {
      let map = {};
      this.sorters.forEach(item => {
        map[item.property] = item.direction;
      });
      return map;
    }
  },

  render() {
    return (
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        class={`${this.prefixCls}-header`}
      >
        <colgroup>
          {this.columns.map(column => (
            <col
              width={column.computedWidth || column.minWidth || column.width}
            />
          ))}
          {this.hasVerticalScroll && <col width={`17px`} />}
        </colgroup>
        <thead>
          <tr class={[`${this.prefixCls}-header-row`]}>
            {this.columns.map((column, columnIndex) => (
              <th
                class={[
                  this.sorterStyle === "column" && "th-selectable",
                  `align-${column.verticalTitleAlign || column.verticalAlign}`,
                  `text-${column.titleAlign || column.textAlign}`
                ]}
                onClick={this.onHeaderColumnClick.bind(this, column)}
              >
                <div
                  class={["column-header-inner d-flex justify-content-between"]}
                >
                  <div
                    class={[
                      "flex-fill",
                      this.mapSorters[column[this.dataIndexProperty]] &&
                        "column-sorter",
                      this.sorterStyle === "icon" && "mode-icon",
                      this.sorterStyle === "column" && "mode-column"
                    ]}
                  >
                    {column.label}
                  </div>

                  {this.sorterStyle === "icon" && this.renderFilterIcon(column)}
                  {this.sorterStyle === "column" &&
                    this.renderFilterColumn(column)}
                </div>
              </th>
            ))}
            {this.hasVerticalScroll && <th />}
          </tr>
        </thead>
      </table>
    );
  }
};
</script>
<style lang="scss" scoped>
.wx-table-header {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 0rem;
}
.sorter {
  align-items: center;

  // justify-content: center;
}

.filter-icon {
  justify-content: space-between;

  margin-top: 1px;
  margin-bottom: 1px;
  .sorter-icon {
    line-height: 0.5;
    opacity: 0.5;
    cursor: pointer;
  }
  .sorter-icon:hover {
    opacity: 1;
  }
  .active {
    opacity: 1;
  }
}

.filter-column {
  justify-content: center;
}

.th-selectable:hover {
  background-color: rgba(0, 0, 0, 0.075);
  cursor: pointer;
}

// .column-sorter.mode-icon {
//   padding-left: 18px;
// }
.column-sorter.mode-column {
  padding-left: 24px;
}

// th:hover a < img { border: none; }{
// }
// th ~ .filter-column {

// }

// .filter-column th:parent {
//   background-color: rgba(0, 0, 0, 0.075);
//   cursor: pointer;
// }

// .filter-column:has(.column-header-inner) {
//   background-color: rgba(0, 0, 0, 0.075);
//   cursor: pointer;
// }

// .column-header-inner:has(.filter-column) {
//   background-color: rgba(0, 0, 0, 0.075);
//   cursor: pointer;
// }
// th:has( >.filter-column) {

// }
</style>
