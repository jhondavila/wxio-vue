import Integer from './Integer';
import Wx from 'Wx';

class FNumber extends Integer {

    type = "float";

    constructor(config) {
        super(config);
        this.isIntegerField = false;
        this.isNumberField = true;
        this.numericType = 'float';

        this.getNumber = Wx.identityFn;
    }

    parse(v) {
        return parseFloat(String(v).replace(this.stripRe, ''));
    }

    
}
export default FNumber;