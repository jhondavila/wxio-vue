<template>
  <b-row class="my-2">
    <div :class="[$labelCls,clsLabel]">
      <label class="col-form-label wx-label">{{label}}</label>
    </div>
    <div :class="[$inputCls,clsInput,'align-self-center']">
      <b-row class="my-0">
        <b-col>
          <b-form-file
            v-model="inputVal"
            class="fileuploadpicker"
            :ref="'fileuploadpicker'"
            :placeholder="placeholder"
            @change="onChangeFile"
          ></b-form-file>
        </b-col>
      </b-row>

      <b-row class="my-0" v-if="preview && (emptyPreview || internalPreview)">
        <b-col>
          <template v-if="internalPreview">
            <div class="wrapper-preview">
              <b-img :src="internalPreview" fluid alt class="image-preview"/>
            </div>
          </template>
          <template v-else>
            <div class="wrapper-preview">
              <b-img :src="'static/icon/empty_image.png'" fluid alt class="image-preview"/>
            </div>
          </template>
        </b-col>
      </b-row>
    </div>
  </b-row>
</template>
<script>
import Layout from "./mixin/Layout";
import Core from "../../../core";
export default {
  name: "wx-fileuploadfield",
  mixins: [Layout],

  data() {
    return {
      inputVal: this.value,
      internalPreview: this.pathPreview
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
      type: String | Number,
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
    }
  },
  watch: {
    inputVal(val) {
      if (Core.isString(val) || !val) {
        this.internalPreview = val;
      }
      this.$emit("input", val);
    },
    value(val) {
      if (!val) {
        this.$refs["fileuploadpicker"].selectedFile = null;
        this.$refs["fileuploadpicker"].$refs["input"].value = null;
      }
      this.inputVal = val;
    }
  },
  methods: {
    onChangeFile(input) {
      let element = input.target;
      let file = element.files[0];
      if (!file) {
        this.internalPreview = null;
        return;
      }
      let imageType = /image.*/;
      if (!file.type.match(imageType)) {
        return;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let result = e.target.result;
        this.internalPreview = result;
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style lang="scss">
.custom-file-label::after {
  content: "Buscar";
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
  padding: 0.5rem;
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
</style>
