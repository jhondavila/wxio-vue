import Core from "./core";
import Util from "./util";
import dom from "./dom";
import IPC from "./util/IPC";




export default {
  ...Core,
  Util,
  dom,
  IPC,
  markup: dom.Helper.markup
};
