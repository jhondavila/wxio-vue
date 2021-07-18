import Wx from 'Wx';
class TextMetrics {

  constructor() {


    this.measure = document.createElement("div");
    document.querySelector("body").appendChild(this.measure);

    Wx.apply(this.measure.style, {
      position: "absolute",
      top: "0px",
      left: "0px"
    });

    Wx.addCls(this.measure, "textmetrics");
    // console.log(this.measure);

    global.TextMetrics = this;
  }

  destroyed() {
    console.log("destroyed")
  }

  bind(el) {

    let styles = this.getStyles(el, ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing', 'word-break']);
    Wx.apply(this.measure.style, styles);


  }

  setFontSize(fontSize) {
    // console.log(fontSize)
    Wx.apply(this.measure.style, {
      "font-size": fontSize
    });
  }

  setFixedWidth(width) {
    Wx.apply(this.measure.style, {
      width: width
    });
  }

  getSize(text) {
    this.measure.innerHTML = text;
    let size = this.measure.getBoundingClientRect();
    this.measure.innerHTML = "";
    return size;
  }

  getHeight(text) {
    return this.getSize(text).height;
  }


  getStyles(el, list) {
    let styles = {};
    for (let x = 0; x < list.length; x++) {
      if (list[x]) {
        styles[list[x]] = this.getStyle(el, list[x]);
      }
    }
    return styles;
  }

  getStyle(el, styleProp) {
    // let el = this.measure;
    var value, defaultView = (el.ownerDocument || document).defaultView;
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
      // sanitize property name to css notation
      // (hypen separated words eg. font-Size)
      styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
      return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } else if (el.currentStyle) { // IE
      // sanitize property name to camelCase
      styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
        return letter.toUpperCase();
      });
      value = el.currentStyle[styleProp];
      // convert other units to pixels on IE
      if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
        return (function (value) {
          var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
          el.runtimeStyle.left = el.currentStyle.left;
          el.style.left = value || 0;
          value = el.style.pixelLeft + "px";
          el.style.left = oldLeft;
          el.runtimeStyle.left = oldRsLeft;
          return value;
        })(value);
      }
      return value;
    }
  }

}



export default new TextMetrics();