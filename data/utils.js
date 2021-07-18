import FTypes from './field';


export default {
    compileFields(fields) {
        let fieldCfg, compiles = {};
        for (let fieldName in fields) {
            if (typeof fields[fieldName] === "string") {
                fieldCfg = {
                    type : fields[fieldName]
                };
            } else {
                fieldCfg = fields[fieldName];
            }
            fieldCfg.name = fieldName;
            if (FTypes[fieldCfg.type]) {
                compiles[fieldName] = new FTypes[fieldCfg.type](fieldCfg);
            } else {
                compiles[fieldName] = new FTypes["default"](fieldCfg);
            }
        }
        return compiles;
    },
    createField(name, config) {
        config = config || {
            type: "default"
        };
        config.name = name;
        if (FTypes[config.type]) {
            return new FTypes[config.type](config);
        } else {
            return new FTypes["default"](config);
        }
    }
};