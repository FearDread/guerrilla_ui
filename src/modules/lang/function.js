/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Function based utility methods  * 
* ---------------------------------------- */
$.GUI().use(function(G) {

    return {

        load: function(api) {

            // Extend api object
            api.utils.merge(api.utils, {

                /**
                 * Delay a functions execution by passed amount of time 
                 *
                 * @param fn {function} - function to bounce 
                 * @param time {number} - amount of time in miliseconds to wait
                 * @param context {object} context to apply to passed function 
                 * @return {function} - keeps from executing passed method before its ready 
                **/
                debounce: function(fn, time, context) {
                    var timeout;

                    return function () {
                        var args = arguments;

                        clearTimeout(timeout);

                        timeout = setTimeout(utils.proxy(function () {
                            fn.apply(this, args);
                        }, context || this), time);
                    };
                },

                /**
                 * Delay a functions execution by passed amount of time 
                 *
                 * @param fn {function} - function to throttle 
                 * @param time {number} - amount of time in miliseconds to wait
                 * @param context {object} context to apply to passed function 
                 * @return {function} - keeps from executing passed method before its ready 
                **/
                throttle: function(fn, time, context) {
                    var run;

                    return function() {
                        var args = arguments,
                            ctx = context || this;

                        if (!run) {
                            run = true;

                            setTimeout(function() {
                                fn.apply(ctx, args);
                                run = false;
                            }, time);
                        }
                    };
                },

                /**
                 * Attempt to defer a function call 
                 *
                 * @param fn {function} - function to defer 
                 * @param context {object} context to apply to passed function 
                 * @return void 
                **/
                defer: function(fn, context) {
                    var args = arguments,
                        ctx = context || this;

                    setTimeout(function() {
                        fn.apply(ctx, args);
                    }, 0);
                }
            });
        }
    };
});
