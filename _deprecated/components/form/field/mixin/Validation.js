import Core from "../../../../core";


export default {
    data() {
        return {
            invalidInternalText: this.invalidText,
            validInternalText: this.validText,
            internalState: this.state
        };
    },
    props: {
        validateOnChange: {
            type: Boolean,
            default: false
        },
        state: {
            type: Boolean,
            default: null
        },
        allowBlank: {
            type: Boolean,
            default: true
        },
        isField: {
            type: Boolean,
            default: true
        },
        invalidText: {
            type: String,
            default: "Valor incorrecto"
        },
        validText: {
            type: String,
            default: "Valido"
        },
        requiredText: {
            type: String,
            default: "Campo obligatorio"
        },
        validation: {
            type: Function
        }
    },
    methods: {
        clearInvalid() {
            //Clear invalid fields
            if (this.internalState === false) {
                this.clearValidation();
            }
        },
        clearValidation() {
            //Clear all validation status (valid and invalid)
            this.invalidInternalText = null;
            this.validInternalText = null;
            this.internalState = null;
        },
        isValid() {
            if (!this.allowBlank && Core.isEmpty(this.inputVal)) {
                this.internalState = false;
                this.invalidInternalText = this.requiredText;
                return false;
            }

            if (!this.validation) {
                this.internalState = null;
                return true;
            }

            let validation = this.validation(this, this.inputVal);
            if (validation === false) {
                this.internalState = false;
                this.invalidInternalText = this.invalidText;
                return false;
            } else if (validation === true) {
                this.internalState = true;
                this.validInternalText = this.validText;
                return true;
            } else if (Core.isString(validation)) {
                this.internalState = false;
                this.invalidInternalText = validation;
                return false;
            } else if (!validation) {
                this.internalState = null;
                return true;
            }
        }
    },
    watch: {
        internalState(val) {
            this.$emit("statechange", val);
        },
        state(val) {
            this.internalState = val;
        },
        inputVal(val) {
            if (this.validateOnChange) {
                this.isValid();
            }
        }
    }
};