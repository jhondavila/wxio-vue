import Core from "../../common/core";

// console.log(Core);
let ipc = function () {
  if (!window.process) {
    return false;
  }
  if (!window.process.versions || !window.process.versions.electron) {
    return false;
  }
  return eval('require("electron")').ipcRenderer;
};

class IPCMgr {
  constructor() {
    this.ipc = ipc();
  }
  send(event) {
    if (!this.ipc) {
      console.log("IPC NO DETECT");
      return;
    }
    this.ipc.send.apply(this.ipc, arguments);
  }
  on(event, fn, scope, args, appendArgs) {
    if (!this.ipc) {
      console.log("IPC NO DETECT");
      return;
    }

    fn = Core.Function.bind(fn, scope, args, appendArgs);

    if (scope) {
      Core.Function.interceptBefore(scope, "$destroy", () => {
        this.ipc.removeListener(event, fn);
      });
    }

    this.ipc.on(event, fn);
  }
  once(event, fn, scope, args, appendArgs) {
    if (!this.ipc) {
      console.log("IPC NO DETECT");
      return;
    }
    fn = Core.Function.bind(fn, scope, args, appendArgs);
    if (scope) {
      Core.Function.interceptBefore(scope, "$destroy", () => {
        this.ipc.removeListener(event, fn);
      });
    }
    this.ipc.once(event, fn);
  }
}

export default new IPCMgr();
