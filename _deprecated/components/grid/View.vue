
<script>
import Resizable from "./Resizable";
import { clearTimeout, setTimeout } from "timers";
export default {
  props: {
    small: {
      type: Boolean,
      default: true
    },
    columns: {
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
    }
  },
  data() {
    return {
      resizer: false,
      timeoutResizable: null,
      tableStyles: {
        // "table-fixed": true
        table: true,
        "wx-table": true,
        "table-sm": this.small,
        "table-striped": this.striped,
        "table-bordered": this.bordered,
        "table-hover": true,
        // "table-responsive": false,
        "table-fixed": true
      }
    };
  },
  render() {
    return (
      <div class="table-container" ref="wrapper">
        <table class={this.tableStyles} ref="table">
          <thead>
            <tr>
              {this.columns.map(col => {
                console.log("render");
                return <th scope="col" class="th-min-width">{col.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>{" "}
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>{" "}
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>{" "}
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>{" "}
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
  destroyed() {
    console.log("destruyendo");
    clearTimeout(this.timeoutResizable);
    if (this.resizer) {
      this.resizer.destroy();
    }
  },
  method: {
    addResizer() {
      this.timeoutResizable = setTimeout(() => {
        //   //   console.log("añadiendo resizable");

        //   // console.log(this.$refs.wrapper.clientWidth);

        this.resizer = new Resizable(this.$refs.table, {
          liveDrag: true,
          draggingClass: "rangeDrag",
          gripInnerHtml: "<div class='rangeGrip'></div>",
          minWidth: 8,
          resizeMode: "overflow",
          disabledColumns: [],
          serialize: false
          // flush : true
        });
        // global.resizer = this.resizer;
        //   console.log();

        // debugger
        this.resizer.tb.style.minWidth =
          Number(
            window.getComputedStyle(this.$refs.wrapper).width.replace(/px/, "")
          ).valueOf() -
          2 +
          "px";

        //
        //   console.log(this.resizer.tb.style.minWidth)
      }, 2000);
    }
  },
  mounted() {
    //   this.addResizer();
    // (function() {
    //   var thElm;
    //   var startX;
    //   var endX;
    //   var size;
    //   var startWidth;
    //   Array.prototype.forEach.call(
    //     document.querySelectorAll("table th"),
    //     function(th) {
    //       th.style.position = "relative";
    //       var grip = document.createElement("div");
    //       grip.innerHTML = "&nbsp;";
    //       grip.style.top = 0;
    //       grip.style.right = 0;
    //       grip.style.bottom = 0;
    //       grip.style.width = "10px";
    //       grip.style.position = "absolute";
    //       grip.style.cursor = "col-resize";
    //       grip.addEventListener("mousedown", function(e) {
    //         thElm = th;
    //         startX = e.pageX;
    //         startWidth = th.offsetWidth;
    //       });
    //       th.appendChild(grip);
    //     }
    //   );
    //   document.addEventListener("transitionend", e => {
    //       console.log(e);
    //     Array.prototype.forEach.call(
    //       document.querySelectorAll("table th"),
    //       th => {
    //         //   console.log(th.clientWidth);
    //         th.style.width = `${th.clientWidth}px`;
    //       }
    //     );
    //   });
    //   document.addEventListener("mousemove", function(e) {
    //     if (thElm) {
    //       endX = e.pageX;
    //       size = endX - startX;
    //       if (size < 0) {
    //         thElm.style.width = `${startWidth - Math.abs(size)}px`;
    //       } else {
    //         thElm.style.width = `${startWidth + Math.abs(size)}px`;
    //       }
    //     }
    //   });
    //   document.addEventListener("mouseup", function() {
    //     thElm = undefined;
    //   });
    // })();
  }
};
</script>

<style>
.table-fixed {
  /* table-layout: fixed; */
}

.th-min-width {
  /* width: 200px; */
  /* min-width: 200px; */
}
.table-container {
  border: 1px solid #dee2e6;
  height: 200px;
}

.wx-table.table {
  margin-bottom: 0rem;
}

.wx-table.table-bordered th {
  border-top: 0px solid #dee2e6;
}

.wx-table.table-bordered tr :first-child {
  border-left: 0px solid #dee2e6;
}

.wx-table.table-bordered tr :last-child {
  /* border-right: 0px solid #dee2e6; */
}

.wx-table.table-bordered tbody :last-child td {
  border-bottom: 0px solid #dee2e6;
}
.wx-table.table-bordered tbody :last-child th {
  border-bottom: 0px solid #dee2e6;
}

.bluecolor {
  color: blue;
}
</style>
