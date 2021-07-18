import BaseColumn from "./Base";

class DefaultColumn extends BaseColumn {
  constructor(config) {
    super(config);
  }

  render(h, table, row, rowIndex, column, columnIndex) {
    return <td key={`col-${columnIndex}-${column[table.dataIndexProperty]}`} >
      <div class={
        [
          "inner-cell",
          `text-` + column.textAlign,
          `align-${column.verticalAlign}`,
        ]

      }>
        {
          this.renderer ?
            this.renderer({
              item: row,
              index: rowIndex,
              field: column[table.dataIndexProperty],
              column,
              columnIndex,
              value: this.getValue(column[table.dataIndexProperty], row)
            }) : this.defaultRenderer(h, table, row, rowIndex, column, columnIndex)

        }
      </div>

    </td>
    // } else {
    //   return ;
    // }
  }
  defaultRenderer(h, table, row, rowIndex, column, columnIndex) {
    return this.getValue(column[table.dataIndexProperty], row);
  }
}

export default DefaultColumn;

