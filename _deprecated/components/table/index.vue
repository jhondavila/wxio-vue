<template>
  <b-card :header="title" class="wx-grid-panel">
    <b-row class="my-2">
      <b-col>
        <slot name="dockedTop"></slot>
      </b-col>
    </b-row>

    <b-table
      :class="classTable"
      :hover="hover"
      :striped="striped"
      :bordered="bordered"
      :small="small"
      :fixed="fixed"
      :responsive="responsive"
      :items="dataTable"
      :fields="columns"
      :current-page="currentPage"
      :per-page="pageSize ? pageSize : null"
      @row-clicked="wrapperClick"
      :sort-by="sortBy"
      :sort-desc="sortDirection === 'desc' || sortDirection === 'DESC' ? true : false"
    >
      <template v-for="field in columns" :slot="field.key" slot-scope="row">
        <slot :name="field.key" v-bind="row">{{ row.item[field.key] }}</slot>
      </template>
    </b-table>
    <nav v-if="pageSize">
      <b-pagination
        :total-rows="getRowCount(dataTable)"
        :per-page="pageSize ? pageSize : null"
        v-model="currentPage"
        prev-text="Atras"
        next-text="Siguiente"
        hide-goto-end-buttons
      />
    </nav>

    <b-row class="my-2">
      <b-col>
        <slot name="dockedBottom"></slot>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import Vue from "vue";
export default {
  name: "wx-gridpanel",
  props: {
    title: {
      type: String,
      default: null
    },
    hover: {
      type: Boolean,
      default: true
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    store: {
      type: Object
    },
    columns: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number | Boolean,
      default: 10
    },
    colAlign: {
      type: String,
      default: "center"
    },
    sortBy: {
      type: String
    },
    sortDirection: {
      type: String
      // default: "asc"
    },
    bind: {
      type: Object
    },
    responsive: {
      type: String | Boolean,
      default: false
    },
    classTable: {
      type: String,
      default: ""
    }
  },
  mounted() {
    let dataTable;
    if (this.store) {
      dataTable = this.store.data;
    } else if (this.bind) {
      // console.log("vinculando con store bind");
      dataTable = this.bind.data;
      let record = this.bind.getOption("record");
      if (!record.phantom) {
        this.bind.load();
      }
    } else {
      dataTable = this.data;
    }
    this.dataTable = dataTable;
    // return dataTable;
  },
  watch: {
    data: function(data) {
      this.dataTable = data;
    },
    store: {
      // deep : true,
      handler: function(store) {
        if (store) {
          this.dataTable = store.data;
        }
      }
    },
    "store.data": {
      handler: function(data) {
        if (data) {
          this.dataTable = data;
        }
      }
    },
    bind: function(store) {
      if (store) {
        this.dataTable = store.data;
        let record = store.getOption("record");
        if (!record.phantom) {
          console.log("cargando store bind");
          store.load();
        }
      }
    }
  },
  data: () => {
    return {
      dataTable: [],
      currentPage: 1,
      totalRows: 0,
      lastedSelected: null
    };
  },
  created() {
    let align;
    for (let x = 0; x < this.columns.length; x++) {
      let col = this.columns[x];
      if (col.align) {
        align = "text-" + col.align;
        col.class = col.class ? `${col.class} ${align}` : `${align} `;
      } else if (this.colAlign) {
        align = "text-" + this.colAlign;
        col.class = col.class ? `${col.class} ${align}` : `${align} `;
      }
    }
  },
  methods: {
    getRowCount(data) {
      return data.length;
    },
    wrapperClick(row, index, event) {
      if (this.lastedSelected) {
        Vue.set(this.lastedSelected, "_rowVariant", "");
      }
      this.lastedSelected = row;
      Vue.set(row, "_rowVariant", "active");
      this.$emit("onrowclick", this, row, index, event);
    },
    getLastSelected() {
      return this.lastedSelected;
    }
  }
};
</script>
