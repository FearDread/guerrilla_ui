


var api;

api = {
  VERSION: "0.5.0",
  util: util,
  Mediator: Mediator,
  Core: Core,
  plugins: {},
  modules: {}
};

if ((typeof define !== "undefined" && define !== null ? define.amd : void 0) != null) {
  define(function() {
    return api;
  });
} else if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = api;
} else if (typeof window !== "undefined" && window !== null) {
  if (window.scaleApp == null) {
    window.scaleApp = api;
  }
}

// ---
// generated by coffee-script 1.9.2