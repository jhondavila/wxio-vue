import Core from "../common/core";

export default {
  ...Core,
  getClassName(item) {
    if (item && item.$getClassName) {
      return item.$getClassName();
    } else {
      return;
    }
  },
  addCls(el, cls) {
    if (cls && this.isElement(el)) {
      el.classList.add(cls);
    } else if (cls && el.$el && this.isElement(el.$el)) {
      el.$el.classList.add(cls);
    }
  },
  getComputedHeight(el) {
    return Number(
      window
        .getComputedStyle(el)
        .height.replace(/px/, "")
    ).valueOf();
  },
  isElement(el) {
    return el && el.nodeType === Node.ELEMENT_NODE;
  },
  removeCls(el, cls) {
    if (cls && this.isElement(el)) {
      el.classList.remove(cls);
    } else if (cls && el.$el && this.isElement(el.$el)) {
      el.$el.classList.remove(cls);
    }
  },
  buildTreeApp: function (applications, parentId, nodeKey, parentKey, fn, deep) {
    var app_tree = [];
    deep = deep === undefined ? -1 : deep;
    if (Array.isArray(applications)) {
      applications.forEach(app => {
        if (app[parentKey] === parentId) {
          var node = {
            meta: app
          };
          var children = this.buildTreeApp(
            applications,
            app[nodeKey],
            nodeKey,
            parentKey,
            fn,
            deep + 1
          );
          if (children.length > 0) {
            app["children"] = children;
          }
          if (children.length === 0) {
            if (app["leaf"] === 0) {
              app["children"] = [];
              app["leaf"] = false;
            } else {
              app["leaf"] = true;
            }
          }
          app.deep = deep + 1;
          node.children = children;

          if (fn) {
            fn(node, children, parentId, deep + 1);
          }
          app_tree.push(node);
        }
      });
    }
    return app_tree;
  },
  buildTreeNode: function (applications, parentId, nodeKey, parentKey, fn) {
    var app_tree = [];
    // var ctrl = this;
    if (Array.isArray(applications)) {
      applications.forEach(app => {
        if (app[parentKey] === parentId) {
          var children = this.buildTreeNode(
            applications,
            app[nodeKey],
            nodeKey,
            parentKey,
            fn
          );
          if (children.length > 0) {
            app["children"] = children;
          }
          if (children.length === 0) {
            if (app["leaf"] === 0) {
              app["children"] = [];
              app["leaf"] = false;
            } else {
              app["leaf"] = true;
            }
          }
          if (fn) {
            fn(app, children, parentId);
          }
          app_tree.push(app);
        }
      });
    }
    return app_tree;
  },
  urlJoin(basePath) {
    if (basePath === "./") {
      basePath = document.location.origin;
    }
    let regExp = new RegExp("^(http|https):\/\/", "gmi");
    let regExpEnd = new RegExp("(\/)$", "gmi");
    if (regExpEnd.exec(basePath)) {
      basePath = basePath.substring(0, basePath.length - 1);
    }

    let appends = Array.prototype.slice.call(arguments, 1, arguments.length);
    let path = appends[0];


    if (path) {
      if (!regExp.exec(path)) {
        if (path.substring(0, 1) === "/") {
          path = basePath + path;
        } else {
          path = basePath + "/" + path;
        }
      }
    }
    if (appends.length > 1) {
      path = this.urlJoin.apply(this, [path].concat(appends.slice(1, appends.length)));
    }
    return path;
  },
  pathPublicFolder: "",
  pathServer: "",
  resolvePublicFile(pathFile) {
    return this.urlJoin(this.pathServer, this.pathPublicFolder, pathFile);
  },
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = e => {
        let result = e.target.result;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  }
};
