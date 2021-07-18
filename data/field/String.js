import Field from './Field';


class FString extends Field {

    type = "string";

    constructor(config) {
        super(config)
        // this.isStringField = true;
    }

    convert(v) {
        var defaultValue = this.allowNull ? null : '';
        return (v === undefined || v === null) ? defaultValue : String(v);
    }

    // getType() {
    //     return 'string';
    // }
}

export default FString;