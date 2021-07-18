<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label wx-label">{{label}}</label>
    </div>
    <div :class="[$inputCls,clsInput,'align-self-center']">
      <b-row class="my-0">
        <b-col>
          <b-form-file
            v-model="fileuploadpicker"
            class="fileuploadpicker"
            :ref="'fileuploadpicker'"
            :placeholder="placeholder"
            @change="onChangeFile"
            :multiple="multiple"
            :browse-text="'Buscar'"
          ></b-form-file>
        </b-col>
      </b-row>

      <b-row
        class="my-0 align-items-center justify-content-center"
        v-if="preview && (emptyPreview || inputVal)"
      >
        <b-col>
          <div class="d-flex flex-wrap justify-content-center align-items-center border rounded">
            <template v-if="inputVal">
              <div class="wrapper-preview" :key="index" v-for="(img,index) in inputVal">
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  @click="removeImage(img,index)"
                >
                  <span aria-hidden="true">&times;</span>
                </button>

                <lightbox
                  class="image-preview"
                  :thumbnail="internalPreview[img[previewPropertyId]]"
                  :images="listResource"
                  v-if="internalPreview[img[previewPropertyId]]"
                  :active="index"
                >
                  <lightbox-default-loader slot="loader"/>
                </lightbox>
              </div>
              <!-- </b-col> -->
            </template>
            <template v-else>
              <b-col class="justify-content-center align-items-center d-flex">
                <div class="wrapper-preview">
                  <b-img :src="'static/icon/empty_image.png'" fluid alt class="image-preview"/>
                </div>
              </b-col>
            </template>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-row>
</template>
<script>
import Layout from "./mixin/Layout";
import Core from "../../core";
import Vue from "vue";

import LightboxComponent from "./../lightbox/Lightbox.vue";
import LightboxDefaultLoader from "./../lightbox/Lightbox.vue";

export default {
  name: "wx-imageuploadfield",
  mixins: [Layout],
  components: {
    Lightbox: LightboxComponent,
    LightboxDefaultLoader
  },
  data() {
    //
    return {
      inputVal: this.value,
      internalPreview: {},
      fileuploadpicker: null
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "Seleccione un archivo..."
    },
    label: {
      type: String | Number,
      default: null
    },
    value: {
      type: Array,
      default: null
    },
    browseText: {
      type: String,
      default: "Buscar"
    },
    preview: {
      type: Boolean,
      default: false
    },
    emptyPreview: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    previewPropertySrc: {
      type: String,
      default: "src"
    },
    previewPropertyId: {
      type: String,
      default: "id"
    },
    previewPropertyFile: {
      type: String,
      default: "file"
    },
    getPathItem: {
      type: Function
    },
    addPosition: {
      type: String,
      default: "end"
    }
    // src: {
    //   type: Function,
    //   default() {
    //     return Core.emptyFn;
    //   }
    // }
  },
  mounted() {
    this.processPreview(this.value);
  },
  computed: {
    listResource() {
      if (this.inputVal) {
        return this.inputVal.map(i => {
          return this.internalPreview[i[this.previewPropertyId]];
        });
      } else {
        return [];
      }
      // let list = [];

      // for (let p in this.internalPreview) {
      //   list.push(this.internalPreview[p]);
      // }
      // return list;
    }
  },
  watch: {
    inputVal(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    value(val) {
      // console.log(val);
      // console.log(val);

      if (Core.isEmpty(val)) {
        this.resetInput();
      } else if (Core.isArray(val)) {
        this.processPreview(val);
      }
      this.inputVal = val;
    }
  },
  methods: {
    async processPreview(val) {
      if (Core.isArray(val)) {
        for (let x = 0; x < val.length; x++) {
          let item = val[x];
          let key = item[this.previewPropertyId];

          if (!this.internalPreview[key]) {
            if (item[this.previewPropertyFile]) {
              this.$set(
                this.internalPreview,
                key,
                await this.loadImage(item[this.previewPropertyFile])
              );
            } else {
              if (this.getPathItem) {
                this.$set(
                  this.internalPreview,
                  key,
                  await this.getPathItem(item)
                );
              }
            }
          }
        }
      }
    },
    resetInput() {
      this.fileuploadpicker = null;

      this.$refs["fileuploadpicker"].selectedFile = null;
      this.$refs["fileuploadpicker"].$refs["input"].value = null;
    },
    removeImage(image, index) {
      // console.log(image);
      let posFile = this.inputVal.indexOf(image);
      if (posFile > -1) {
        this.inputVal.splice(posFile, 1);
      }

      // let posPreview = this.internalPreview.indexOf(image);
      // if (posPreview > -1) {
      //   this.internalPreview.splice(posPreview, 1);
      // }
    },
    async onChangeFile(input) {
      let element = input.target;

      let files = element.files;

      if (files.length === 0) {
        return;
      }
      let file;
      let imageType = /image.*/;
      let list = [];

      for (let x = 0; x < files.length; x++) {
        file = files[x];
        if (file.type.match(imageType)) {
          list.push(file);
        }
      }

      if (list.length === 0) {
        return;
      }

      if (!this.inputVal) {
        this.inputVal = [];
      }
      this.resetInput();
      // debugger

      if (this.addPosition === "end") {
        for (let x = 0; x < list.length; x++) {
          let id = Core.id(null, "image-");
          Core.Array.push(this.inputVal, [
            {
              [this.previewPropertyId]: id,
              [this.previewPropertyFile]: list[x]
            }
          ]);
          this.$set(this.internalPreview, id, await this.loadImage(list[x]));
        }
      } else if (this.addPosition === "start") {
        list = list.reverse();
        for (let x = 0; x < list.length; x++) {
          let id = Core.id(null, "image-");
          Core.Array.insert(this.inputVal, 0, [
            {
              [this.previewPropertyId]: id,
              [this.previewPropertyFile]: list[x]
              // [this.previewPropertySrc]: await this.loadImage(list[x])
            }
          ]);
          this.$set(this.internalPreview, id, await this.loadImage(list[x]));
        }
      }
    },
    loadImage(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = e => {
          let result = e.target.result;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    }
  }
};
</script>

<style lang="scss">
.custom-file-label::after {
  content: "Buscar" !important;
}
</style>

<style lang="scss" scoped>
.image-preview {
  max-width: 200px;
  max-height: 200px;
  padding: 0.5rem;

  object-fit: contain;
  // background-color: #8080801c;
}
.wrapper-preview {
  position: relative;
  padding: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  width: 200px;
  height: 200px;
  display: flex;
  border-style: solid;
  border-width: 1px;
  border-color: #80808069;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(230, 230, 230, 0.3);
}

.b-form-file,
.custom-file-label {
  overflow: hidden;
}

.close {
  position: absolute;
  top: 2%;
  right: 4%;
}
</style>
