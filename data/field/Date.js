import Field from './Field';

class FDate extends Field {

    type = "date";

    constructor(config) {
        super(config);
        this.isDateField = true;
    }

    convert(v) {
        if (v) {
            try {
                return new Date(v);
            } catch (error) {
                return;
            }
        } else {
            return;
        }
    }

    serialize(val) {
        if (val) {
            return val.toJSON()
        } else {
            return;
        }
    }
    // getType() {
    //     return 'bool';
    // }
}

export default FDate;