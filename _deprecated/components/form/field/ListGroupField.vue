<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]" :ref="'label'">
      <label class="col-form-label wx-label">{{label}}</label>
      <div class="col-form-label wx-label wx-two-points" v-if="twoPoint">:</div>
    </div>
    <div :class="[$inputCls,clsInput]">
      <b-list-group>
        <b-list-group-item
          class="d-flex justify-content-between align-items-center px-3"
          @dblclick="editItem(item)"
          v-for="(item,index) in listNote"
          :key="index"
        >
          <div
            :class="{'alert-light' : (item.type === 'empty' ? true : false),'m-0': true, 'font-family' : true}"
            v-if="activeEdit !== item"
            v-html="item.text"
          ></div>

          <b-form-textarea
            v-model="note"
            placeholder
            :rows="3"
            :max-rows="6"
            maxlength="220"
            v-if="activeEdit === item"
            v-focus
            v-select-text
            @keyup.native.esc.stop="cancelRenaming"
          ></b-form-textarea>

          <div class="d-flex flex-column ml-3">
            <b-button
              class="my-1 px-2"
              variant="outline-primary"
              size="sm"
              @click="endRenaming(item)"
              v-if="activeEdit === item"
            >
              <fa-icon icon="check"/>
            </b-button>
            <b-button
              class="my-1 px-2"
              variant="outline-danger"
              size="sm"
              @click="cancelRenaming"
              v-if="activeEdit === item"
            >
              <fa-icon icon="ban"/>
            </b-button>
            <div class="d-flex">
              <b-button
                variant="outline-primary"
                class="mx-min px-2"
                size="sm"
                @click="editItem(item)"
                v-if="activeEdit !== item && item.type == 'empty'"
              >
                <fa-icon icon="plus"/>
              </b-button>

              <b-button
                variant="outline-primary"
                class="mx-min px-2"
                size="sm"
                @click="editItem(item)"
                v-if="activeEdit !== item && item.type !== 'empty'"
              >
                <fa-icon icon="edit"/>
              </b-button>

              <b-button
                variant="outline-danger"
                class="mx-min px-2"
                size="sm"
                @click="onClickRemove(item)"
                v-if="activeEdit !== item && item.type !== 'empty'"
              >
                <fa-icon icon="trash"/>
              </b-button>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
      <!-- </div>
      </div>-->
    </div>
  </b-row>
</template>

<script>
import Layout from "./mixin/Layout";
import Core from "./../../../core";
export default {
  name: "wx-listgroupfield",
  mixins: [Layout],
  directives: {
    focus: {
      // directive definition
      inserted(el) {
        el.focus();
      }
    },
    selectText: {
      inserted(el) {
        el.select();
      }
    }
  },
  data() {
    return {
      inputVal: this.value,
      // renaming: null,
      activeEdit: null,
      note: null
    };
  },
  props: {
    label: {
      type: String | Number,
      default: null
    },
    placeholder: {
      type: String | Number,
      default: null
    },
    value: {
      type: Array,
      default: null
    },
    twoPoint: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: "text"
    },
    state: {
      type: String,
      default: null
    }
  },
  watch: {
    inputVal(val) {
      
      this.$emit("input", val);
      this.$emit("change", val);
    },
    value(val) {
      // console.log(val);
      this.inputVal = val;
    }
  },
  computed: {
    listNote() {
      console.log("listNote");

      let list = [
        {
          id: "empty",
          text: "Doble Click para añadir una observación",
          type: "empty"
        }
      ];

      // if (typeof this.inputVal === "string") {
      //   list.push(this.inputVal);
      // return [this.inputVal];
      if (Array.isArray(this.inputVal)) {
        list = list.concat(this.inputVal);
        // return this.inputVal;
      }

      // console.log(list);

      return list;
    }
  },
  methods: {
    onFocus(event) {
      this.$emit("focus", event);
    },
    onInputClick(event) {
      // console.log("xxx")
      this.$emit("inputclick", this, this.$refs.input, event);
      // this.$emit("inputxclick", this, this.$refs.input, event);
    },
    editItem(item) {
      // console.log(arguments)
      // console.log("onDblClickRoot");
      // this.startRenaming();
      this.note = item.type === "empty" ? "" : item.text;
      this.activeEdit = item;
    },
    // startRenaming() {
    //   // this.deselect();
    //   // this.renameNewLabel = this.data[this.labelProp];
    //   // this.renaming = true;
    // },
    endRenaming(item) {
      if (!this.inputVal) {
        this.inputVal = [];
      }

      // if (typeof this.inputVal === "string") {
      //   this.inputVal = [this.inputVal];
      // }

      if (item.type === "empty") {
        if (this.note && this.note.trim() && item) {
          this.inputVal.push({
            id: Core.id(),
            text: this.note
          });
        }
      } else {
        item.text = this.note;
      }

      this.note = null;
      this.activeEdit = null;
    },
    onClickRemove(item) {
      Core.Array.remove(this.inputVal, item);
      // console.log(item);
    },
    cancelRenaming() {
      this.note = "";
      this.activeEdit = null;
      // this.renaming = false;
      console.log("cancelRenaming");
    }
  }
};
</script>

<style lang="scss" scoped>
.wx-two-points {
  position: absolute;
  top: 0%;
  right: 0%;
}

.font-family {
  font-family: inherit;

  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
