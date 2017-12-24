/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Task Runner Utility methods for *
* all modules                              * 
* ---------------------------------------- */

var GRun, utils = utils || {};

utils.run = {};

/**
* Run all modules one after another 
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.all = function (args, fn, cb, force) {
    var a, tasks;

    if (!args || args === null) {
        args = [];
    }

    tasks = (function() {
        var j, len, results1;

        results1 = [];

        for (j = 0, len = args.length; j < len; j++) {
            a = args[j];

            results1.push((function(a) {
                return function(next) {
                    return fn(a, next);
                };
            })(a));
        }

        return results1;

    })();

    return this.parallel(tasks, cb, force);
};

/**
* Run asynchronous tasks in parallel 
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.parallel = function (tasks, cb, force) {
    var count, errors, hasErr, i, j, len, results, paralleled, task;

    if (!tasks || tasks === null) {

        tasks = [];

    }else if (!cb || cb === null) {

        cb = (function() {});
    }

    count = tasks.length;
    results = [];

    if (count === 0) {
        return cb(null, results);
    }

    errors = [];

    hasErr = false;
    paralleled = [];

    for (i = j = 0, len = tasks.length; j < len; i = ++j) {
        task = tasks[i];

        paralleled.push((function(t, idx) {
            var e, next;

            next = function() {
                var err, res;

                err = arguments[0];
                res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

                if (err) {
                    errors[idx] = err;
                    hasErr = true;

                    if (!force) {
                        return cb(errors, results);
                    }
                } else {
                    results[idx] = res.length < 2 ? res[0] : res;
                }

                if (--count <= 0) {
                    if (hasErr) {
                        return cb(errors, results);
                    } else {
                        return cb(null, results);
                    }
                }
            };

            try {

                return t(next);

            } catch (_error) {
                e = _error;
                return next(e);
            }
        })(task, i));
    }

    return paralleled;
};

/**
* Run asynchronous tasks one after another 
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.series = function (tasks, cb, force) {
    var count, errors, hasErr, i, next, results;

    if (!tasks || tasks === null) {
        tasks = [];
    }
    if (!cb || cb === null) {
        cb = (function() {});
    }

    i = -1;

    count = tasks.length;
    results = [];

    if (count === 0) {
        return cb(null, results);
    }

    errors = [];
    hasErr = false;

    next = function() {
        var e, err, res;

        err = arguments[0];
        res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

        if (err) {
            errors[i] = err;
            hasErr = true;

            if (!force) {
                return cb(errors, results);
            }
        } else {
            if (i > -1) {
                results[i] = res.length < 2 ? res[0] : res;
            }
        }

        if (++i >= count) {

            if (hasErr) {
                return cb(errors, results);
            } else {
                return cb(null, results);
            }
        } else {

            try {
                return tasks[i](next);
            } catch (_error) {
                e = _error;
                return next(e);
            }
        }
    };

    return next();
};

/**
* Run first task, which does not return an error 
*
* @param tasks {array} - tasks list 
* @param cb {function} - callback method
* @param force {boolean} - optional force errors
* @return {function} execute 
**/
utils.run.first = function (tasks, cb, force) {
    var count, errors, i, next, result;

    if (!tasks || tasks === null) {
        tasks = [];
    }
    if (!cb || cb === null) {
        cb = (function() {});
    }

    i = -1;

    count = tasks.length;
    result = null;

    if (!count || count === 0) {
        return cb(null);
    }

    errors = [];

    next = function() {
        var e, err, res;

        err = arguments[0];
        res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

        if (err) {
            errors[i] = err;

            if (!force) {
                return cb(errors);
            }
        } else {

            if (i > -1) {

                return cb(null, res.length < 2 ? res[0] : res);
            }
        }

        if (++i >= count) {

            return cb(errors);

        } else {

            try {

                return tasks[i](next);

            } catch (_error) {

                e = _error;
                return next(e);
            }
        }
    };

    return next();
};

/**
* Run asynchronous tasks one after another
* and pass the argument
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.waterfall = function (tasks, cb) {
    var i, next;

    i = -1;

    if (tasks.length === 0) {
        return cb();
    }

    next = function() {
        var err, res;

        err = arguments[0];
        res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

        if (err !== null) {
            return cb(err);
        }

        if (++i >= tasks.length) {

            return cb.apply(null, [null].concat(utils.slice.call(res)));

        } else {

            return tasks[i].apply(tasks, utils.slice.call(res).concat([next]));
        }
    };

    return next();
};
