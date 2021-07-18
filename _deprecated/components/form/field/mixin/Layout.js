
export default {
    props: {
        labelEmpty: {
            type: Boolean,
            default: false
        },
        labelAlign: {
            type: String,
            default: "left"
        },
        labelSize: {
            type: Object,
            default: null
        },
        inputSize: {
            type: Object,
            default: null
        },
        autoSize: {
            type: Boolean,
            default: true
        },
        defaultSize: {
            type: Object,
            default: function () {
                return {
                    label: "col-sm-7",
                    input: "col-sm-17"
                };
            }
        },
        clsLabel: {
            type: String | Number,
            default: ""
        },
        clsInput: {
            type: String | Number,
            default: ""
        },

    },
    computed: {
        $wrapperCls() {
            let cls = [];
            if (this.labelAlign === "top" || this.labelAlign === "bottom") {
                cls.push("flex-column")
            }
            return cls.join(" ");
        },
        $labelCls() {
            let sizes = this.labelSize;

            let option = "label";
            let cls = [];

            if (!this.label && !this.labelEmpty) {
                cls.push("d-none");
            }

            if (!sizes && this.autoSize && this.defaultSize[option]) {

                if (this.labelAlign === "left") {
                    cls.push(this.defaultSize[option]);
                } else {
                    cls.push("col-auto");

                }
                // return this.defaultSize[option];
            } else if (sizes) {

                for (let size in sizes) {
                    if (size !== "cols") {
                        cls.push(`col-${size}-${sizes[size]}`);
                    } else {
                        cls.push(`col-${sizes[size]}`);
                    }
                }
                if (cls.length === 0 && this.autoSize) {
                    cls.push(this.defaultSize[option]);
                }
                // 
            }

            if (this.labelAlign === "right") {
                cls.push("order-2")
            }
            return cls.join(" ");
        },
        $inputCls() {
            let sizes = this.inputSize;

            let option = "input";
            let cls = [];

            
            // if(!sizes){
            //     debugger
            // }

            if (!this.label && !this.labelEmpty) {
                cls.push("col");

            } else if (!sizes && this.autoSize && this.defaultSize[option]) {
                if (this.labelAlign === "left") {
                    cls.push(this.defaultSize[option]);
                } else {
                    cls.push("col-auto");
                }
                // return this.defaultSize[option];
            } else if (sizes) {
                // let cls = [];
                // debugger
                for (let size in sizes) {
                    if (size !== "cols") {
                        cls.push(`col-${size}-${sizes[size]}`);
                    } else {
                        cls.push(`col-${sizes[size]}`);
                    }
                }
                if (cls.length === 0 && this.autoSize) {
                    cls.push(this.defaultSize[option]);
                }
                // return cls.join(" ");
            }

            if (this.labelAlign === "right") {
                cls.push("order-1")
            }

            // console.log(sizes,cls)
            return cls.join(" ");

        }
    },
    methods: {
        // $sizeFormat(sizes, option) {
        //     // console.log(sizes);
        //     if (!sizes && this.autoSize && this.defaultSize[option]) {
        //         return this.defaultSize[option];
        //     } else if (sizes) {
        //         let cls = [];

        //         for (let size in sizes) {
        //             if (size !== "cols") {
        //                 cls.push(`col-${size}-${sizes[size]}`);
        //             } else {
        //                 cls.push(`col-${sizes[size]}`);
        //             }
        //         }

        //         if (cls.length === 0 && this.autoSize) {
        //             cls.push(this.defaultSize[option]);
        //         }
        //         return cls.join(" ");
        //     }
        // }
    }
};