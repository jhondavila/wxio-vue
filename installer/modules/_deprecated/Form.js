import Vue from "vue";

import textfield from "../../components/form/field/TextField";
import numberfield from "../../components/form/field/NumberField";
import radiogroup from "../../components/form/field/RadioGroup";
import checkboxgroup from "../../components/form/field/CheckBoxGroup";
import fielduploadfield from '../../components/form/field/FileUploadField';
import imageuploadfield from '../../components/form/field/ImageUploadField';
import checkbox from "../../components/form/field/CheckBox";
import form from "../../components/form/Panel";
import displayfield from "../../components/form/field/DisplayField";
import combobox from "../../components/form/field/Combobox";
import listgroupfield from "../../components/form/field/ListGroupField";
import ComboMulti from '../../components/form/field/comboboxmulti';
import DatePicker from '../../components/form/field/DatePicker';
import TimePicker from '../../components/form/field/TimePicker/index';
import textfieldGroup from '../../components/form/field/TextFieldGroup'
import fieldset from "../../components/form/field/fieldset";
import textareafield from '../../components/form/field/TextAreaField'
import tplfield from "../../components/form/field/TplField";



Vue.component("wx-textfield", textfield);
Vue.component("wx-numberfield", numberfield);
Vue.component("wx-radiogroup", radiogroup);
Vue.component("wx-checkboxgroup", checkboxgroup);
Vue.component("wx-checkbox", checkbox);
Vue.component("wx-fieldset", fieldset);
Vue.component("wx-fileuploadfield", fielduploadfield);
Vue.component("wx-form", form);
Vue.component("wx-listgroupfield", listgroupfield);
Vue.component("wx-textfield-group", textfieldGroup);
Vue.component("wx-combobox", combobox);
Vue.component("wx-displayfield", displayfield);
Vue.component("wx-combomulti", ComboMulti);
Vue.component("wx-datepicker", DatePicker);
Vue.component("wx-timepicker", TimePicker);
Vue.component("wx-imageuploadfield", imageuploadfield);
Vue.component("wx-textareafield", textareafield);
Vue.component("wx-tplfield", tplfield);

