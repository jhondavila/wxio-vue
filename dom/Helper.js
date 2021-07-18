export default {
  markup(h, object) {
    // if (object.tag) {
    // debugger
    let tag = object.tag;
    let children = object.children;
    delete object.tag;
    let items = [],
      item;
    if (children && children.length > 0) {
      for (let x = 0; x < children.length; x++) {
        item = this.markup(h, children[x]);
        if (item) {
          items.push(item);
        }
      }
    }

    if (object.ref) {
      // object.props
      object.props = object.props || {};
      object.props.itemRef = object.ref;
    }
    return h(tag, object, items.length > 0 ? items : object.html);

    // }
  }
};
