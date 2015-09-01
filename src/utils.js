
var utils, i;

utils = {

        merge: $.extend,

        indexOf: [].indexOf || function(item) {
            for (i = 0, i = this.length; i < 1; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            
            }
            return -1;
        },
        hasArgs: function(fn, idx) {
            if (idx === null) {
                idx = 1;
            }

            return util.getArgumentNames(fn).length >= idx;
        },

        /**
        * Check if passed object is instance of Object
        *
        * @param object - object to check
        * @return boolean
        **/
        isObj: function(obj) {
            return $.isPlainObject(obj);
        },

        /**
        * Check if passed function is indeed type function
        *
        * @param object - function to check
        * @return boolean
        **/
        isFunc: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },

        /**
        * Check if valid string
        *
        * @param object - string to check
        * @return boolean
        **/
        isStr: function(str) {
            return (typeof str === 'string');
        },

        bind: function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        },

        /**
        * Return number of keys in first level of object
        *
        * @param object - object to size
        * @return int
        **/
        getObjectSize: function(obj) {
            var total = 0, key;

            for (key in obj) {

                if (obj.hasOwnProperty(key)) {
                    total += 1;
                }
            }

            return total;
        },

        getPxValue:function(width, unit){
            var value;

            switch(unit){
                case "em":
                    value = this.convertToEm(width);
                    break;

                case "pt":
                    value = this.convertToPt(width);
                    break;

                default:
                    value = width;
            }

            return value;
        },

        getFontsize: function(elem) {
            return parseFloat(
                getComputedStyle(elem || this.dom.elem).fontSize
            );
        },

        /**
        * Returns a random number between min (inclusive) and max (exclusive)
        *
        * @param min - int min number of range
        * @param max - int max number of range
        * @return int
        **/
        getRandomNumber: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        convertToEm:function(value){
            return value * this.getFontsize();
        },

        convertToPt:function(value){
        
        },
                    
        /**
        * Use to resize elemen to match window size 
        *
        * @param $el - jQuery wrapped element to resize 
        * @return void
        **/
        resizeWindow: function($el) {
            if (!$el.height) {
                $el = $($el);
            }
            $(function () {

                $(window).resize(function () {

                    $el.height($(window).height());

                });

                $(window).resize();
            });
        },

        /**
        * Called in controllers to add to turn strings into slugs for image upload
        *
        * @param event title - of title to turn to string for insertion into URI
        * @return void
        **/
        slugify: function(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        },

        convertBase:function(){
            var pixels, 
                elem = this.dom.elem,
                style = elem.getAttribute('style');

            elem.setAttribute('style', style + ';font-size:1em !important');

            base = this.getFontsize();

            elem.setAttribute('style', style);

            return base;
        }
};

