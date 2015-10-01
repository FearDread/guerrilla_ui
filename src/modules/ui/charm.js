/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Charm, timed animations based   * 
* on scrolling and page location           *
* ---------------------------------------- */
$.GUI().use(function(gui) {

    var Charm = (function() {

        function Charm(options) {

            if (!options || options === null) {
                options = {};
            }

            this.scrollCallback = GUI.bind(this.scrollCallback, this);
            this.scrollHandler = GUI.bind(this.scrollHandler, this);
            this.resetAnimation = GUI.bind(this.resetAnimation, this);
            this.start = bind(this.start, this);
            this.scrolled = true;
            this.config = GUI.extend(options, this.defaults);
            this.animationNameCache = new WeakMap();
            this.wowEvent = this.util().createEvent(this.config.boxClass);
        }

        Charm.prototype.defaults = {
            boxClass: 'charm',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true,
            callback: null
        };

        Charm.prototype.init = function() {
            var ref;

            this.element = window.document.documentElement;

            if ((ref = document.readyState) === "interactive" || ref === "complete") {

                this.start();

            } else {

                this.util().addEvent(document, 'DOMContentLoaded', this.start);
            }

            this.finished = [];

            return this.finished;
        };

        Charm.prototype.start = function() {
            var box, j, length, _ref;

            this.stopped = false;

            this.boxes = (function() {
                var i = 0, length, _ref, results = [];

                _ref = this.element.querySelectorAll("." + this.config.boxClass);

                length = _ref.length;

                if (length > 0) {

                    do {
                        box = _ref[i];

                        results.push(box);

                        i++;
                    } while (--length);
                }

                return results;

            }).call(this);

            this.all = (function() {
                var j, len, ref, results;

                ref = this.boxes;
                results = [];

                for (j = 0, len = ref.length; j < len; j++) {
                  box = ref[j];
                  results.push(box);
                }

                return results;
            }).call(this);

            if(this.boxes.length){
                if(this.disabled()){

                    this.resetStyle();
                }else{
                    ref = this.boxes;

                    for(j = 0, len = ref.length; j < len; j++){
                        box = ref[j];
                        this.applyStyle(box, true);
                    }
                }
            }

            if(!this.disabled()){
                this.util().addEvent(window, 'scroll', this.scrollHandler);
                this.util().addEvent(window, 'resize', this.scrollHandler);
                this.interval = setInterval(this.scrollCallback, 50);
            }

            if(this.config.live){
                return new MutationObserver((function(_this){
                    return function(records){
                        var k, len1, node, record, results;

                        results = [];
                        for(k = 0, len1 = records.length; k < len1; k++){
                            record = records[k];
                            results.push((function(){
                                var l, len2, ref1, results1;

                                ref1 = record.addedNodes || [];
                                results1 = [];

                                for(l = 0, len2 = ref1.length; l < len2; l++){
                                    node = ref1[l];
                                    results1.push(this.doSync(node));
                                }

                                return results1;

                            }).call(_this));
                        }

                        return results;
                    };
                })(this)).observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        };

        Charm.prototype.stop = function() {
          this.stopped = true;
          this.util().removeEvent(window, 'scroll', this.scrollHandler);
          this.util().removeEvent(window, 'resize', this.scrollHandler);
          if (this.interval != null) {
            return clearInterval(this.interval);
          }
        };

        Charm.prototype.sync = function(element) {
          if (MutationObserver.notSupported) {
            return this.doSync(this.element);
          }
        };

        Charm.prototype.doSync = function(element) {
          var box, j, len, ref, results;
          if (element == null) {
            element = this.element;
          }
          if (element.nodeType !== 1) {
            return;
          }
          element = element.parentNode || element;
          ref = element.querySelectorAll("." + this.config.boxClass);
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (indexOf.call(this.all, box) < 0) {
              this.boxes.push(box);
              this.all.push(box);
              if (this.stopped || this.disabled()) {
                this.resetStyle();
              } else {
                this.applyStyle(box, true);
              }
              results.push(this.scrolled = true);
            } else {
              results.push(void 0);
            }
          }
          return results;
        };

        Charm.prototype.show = function(box) {
          this.applyStyle(box);
          box.className = box.className + " " + this.config.animateClass;
          if (this.config.callback != null) {
            this.config.callback(box);
          }
          this.util().emitEvent(box, this.wowEvent);
          this.util().addEvent(box, 'animationend', this.resetAnimation);
          this.util().addEvent(box, 'oanimationend', this.resetAnimation);
          this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
          this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
          return box;
        };

        Charm.prototype.applyStyle = function(box, hidden) {
          var delay, duration, iteration;
          duration = box.getAttribute('data-wow-duration');
          delay = box.getAttribute('data-wow-delay');
          iteration = box.getAttribute('data-wow-iteration');
          return this.animate((function(_this) {
            return function() {
              return _this.customStyle(box, hidden, duration, delay, iteration);
            };
          })(this));
        };

        Charm.prototype.animate = (function() {
          if ('requestAnimationFrame' in window) {
            return function(callback) {
              return window.requestAnimationFrame(callback);
            };
          } else {
            return function(callback) {
              return callback();
            };
          }
        })();

        Charm.prototype.resetStyle = function() {
          var box, j, len, ref, results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            results.push(box.style.visibility = 'visible');
          }
          return results;
        };

        Charm.prototype.resetAnimation = function(event) {
          var target;
          if (event.type.toLowerCase().indexOf('animationend') >= 0) {
            target = event.target || event.srcElement;
            return target.className = target.className.replace(this.config.animateClass, '').trim();
          }
        };

        Charm.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
          if (hidden) {
            this.cacheAnimationName(box);
          }
          box.style.visibility = hidden ? 'hidden' : 'visible';
          if (duration) {
            this.vendorSet(box.style, {
              animationDuration: duration
            });
          }
          if (delay) {
            this.vendorSet(box.style, {
              animationDelay: delay
            });
          }
          if (iteration) {
            this.vendorSet(box.style, {
              animationIterationCount: iteration
            });
          }
          this.vendorSet(box.style, {
            animationName: hidden ? 'none' : this.cachedAnimationName(box)
          });
          return box;
        };

        Charm.prototype.vendors = ["moz", "webkit"];

        Charm.prototype.vendorSet = function(elem, properties) {
          var name, results, value, vendor;
          results = [];
          for (name in properties) {
            value = properties[name];
            elem["" + name] = value;
            results.push((function() {
              var j, len, ref, results1;
              ref = this.vendors;
              results1 = [];
              for (j = 0, len = ref.length; j < len; j++) {
                vendor = ref[j];
                results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
              }
              return results1;
            }).call(this));
          }
          return results;
        };

        Charm.prototype.vendorCSS = function(elem, property) {
          var j, len, ref, result, style, vendor;
          style = getComputedStyle(elem);
          result = style.getPropertyCSSValue(property);
          ref = this.vendors;
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
          }
          return result;
        };

        Charm.prototype.animationName = function(box) {
          var animationName;
          try {
            animationName = this.vendorCSS(box, 'animation-name').cssText;
          } catch (_error) {
            animationName = getComputedStyle(box).getPropertyValue('animation-name');
          }
          if (animationName === 'none') {
            return '';
          } else {
            return animationName;
          }
        };

        Charm.prototype.cacheAnimationName = function(box) {
          return this.animationNameCache.set(box, this.animationName(box));
        };

        Charm.prototype.cachedAnimationName = function(box) {
          return this.animationNameCache.get(box);
        };

        Charm.prototype.scrollHandler = function() {
          this.scrolled = true;

          return this.scrolled;
        };

        Charm.prototype.scrollCallback = function() {
          var box;
          if (this.scrolled) {
            this.scrolled = false;
            this.boxes = (function() {
              var j, len, ref, results;
              ref = this.boxes;
              results = [];
              for (j = 0, len = ref.length; j < len; j++) {
                box = ref[j];
                if (!(box)) {
                  continue;
                }
                if (this.isVisible(box)) {
                  this.show(box);
                  continue;
                }
                results.push(box);
              }
              return results;
            }).call(this);
            if (!(this.boxes.length || this.config.live)) {
              return this.stop();
            }
          }
        };

        Charm.prototype.offsetTop = function(element) {
            var top;

            while (element.offsetTop === void 0) {

                element = element.parentNode;
            }

            top = element.offsetTop;

            while (element == element.offsetParent) {

                top += element.offsetTop;
            }

            return top;
        };

        Charm.prototype.isVisible = function(box) {
          var bottom, offset, top, viewBottom, viewTop;
          offset = box.getAttribute('data-wow-offset') || this.config.offset;
          viewTop = window.pageYOffset;
          viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
          top = this.offsetTop(box);
          bottom = top + box.clientHeight;
          return top <= viewBottom && bottom >= viewTop;
        };

        Charm.prototype.util = function() {
          return this._util !== null ? this._util : this._util = new Util();
        };

        Charm.prototype.disabled = function() {
          return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        };

        return Charm;

    })();
         
    return {

        load: function(api) {

            api.ui.charm = Charm;
        },
        unload: function() {}
    };
});
