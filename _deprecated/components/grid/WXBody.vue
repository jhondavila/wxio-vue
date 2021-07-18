<script>
// import Column from "./columns/Column";
export default {
  components: {
    // Column
  },
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
    emptyText: {
      type: String
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    dataIndexProperty: {
      type: String
    },
    tableScoped: {
      type: Object
    }
  },
  methods: {
    // renderCell(row, rowIndex, column, columnIndex) {
    //   if (this.tableScoped[column[this.dataIndexProperty]]) {
    //     return (
    //       <td>
    //         {this.tableScoped[column[this.dataIndexProperty]]({
    //           item: row,
    //           index: rowIndex,
    //           field: column[this.dataIndexProperty],
    //           column,
    //           columnIndex,
    //           value: row[column[this.dataIndexProperty]]
    //         })}
    //       </td>
    //     );
    //   } else {
    //     return column.defaultRenderer(
    //       h,
    //       this,
    //       row,
    //       rowIndex,
    //       column,
    //       columnIndex
    //     );
    //   }
    // }
  },
  watch: {
    data() {
      // console.log("data changed");
      this.$nextTick(() => {
        this.$emit("dataChange");
      });
    },
    tableScoped(value, oldValue) {
      console.log("tableScoped");
      // console.log(oldValue)
      // // console.log(arguments)
      // // console.log("tableScoped");
      // console.log(value === oldValue)
      this.columns.map(col => {
        col.renderer = this.tableScoped[col[this.dataIndexProperty]];
      });
    }
  },
  mounted() {
    this.columns.map(col => {
      col.renderer = this.tableScoped[col[this.dataIndexProperty]];
    });
    // this.$nextTick(() => {
    //   this.$emit("bodyRendered");
    // });
  },
  render(h) {
    // console.log("render body")
    //   console.log("rrenderbody")
    // console.log(h)
    return (
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        class={`${this.prefixCls}-body`}
      >
        <colgroup>
          {this.columns.map(column => (
            <col
              width={column.computedWidth || column.minWidth || column.width}
            />
          ))}
        </colgroup>
        <tbody>
          {this.data.length > 0 ? (
            this.data.map((row, rowIndex) => {
              return (
                <tr key={`row-${rowIndex}`}>
                  {this.columns.map((column, columnIndex) => {
                    // console.log(column)
                    return column.render(
                      h,
                      this,
                      row,
                      rowIndex,
                      column,
                      columnIndex
                    );
                    // return column.renderer
                    //   ? column.renderer({
                    //       row,
                    //       rowIndex,
                    //       column,
                    //       columnIndex,
                    //       value: column.getValue(
                    //         column[this.dataIndexProperty],
                    //         row
                    //       )
                    //     })
                    //   : column.render(
                    //       h,
                    //       this,
                    //       row,
                    //       rowIndex,
                    //       column,
                    //       columnIndex
                    //     );
                    // return this.renderCell.call(
                    //   this,
                    //   row,
                    //   rowIndex,
                    //   column,
                    //   columnIndex
                    // );
                  })}
                </tr>
              );
            })
          ) : (
            <tr class={`${this.prefixCls}--empty-row`}>
              <td
                class={`${this.prefixCls}__body-cell ${
                  this.prefixCls
                }--empty-content`}
                colspan={this.columns.length}
              >
                {this.emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
};
</script>

<style lang="scss" scoped>
.wx-table-body {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 0rem;
}
</style>
