/* Native Type Extensions */
$.GUI().use(function(G) {

    var strDash = /([a-z\d])([A-Z])/g,
        strUndHash = /_|-/,
        strQuote = /"/g,
        strColons = /\=\=/,
        strWords = /([A-Z]+)([A-Z][a-z])/g,
        strLowUp = /([a-z\d])([A-Z])/g,
        strReplacer = /\{([^\}]+)\}/g,
        strSingleQuote = /'/g,
        strHyphenMatch = /-+(.)?/g,
        strCamelMatch = /[a-z][A-Z]/g;

    function convert(content) {
        var invalid;

        // Convert bad values into empty strings
        invalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';

        return '' + ((invalid) ? '' : content);
    }

    function container(current) {
        return /^f|^o/.test(typeof current);
    }

    function next(obj, prop, add) {
        var result = obj[prop];

        if (result === undefined && add === true) {

            result = obj[prop] = {};
        }

        return result;
    }

    function _load(api) {

        api.Lang = {

            esc: function(content) {
                return convert(content)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(strQuote, '&#34;')
                    .replace(strSingleQuote, '&#39;');
            },

            getObject: function (name, roots, add) {
                // The parts of the name we are looking up
                // `['App','Models','Recipe']`
                var parts = name ? name.split('.') : [],
                    length = parts.length,
                    current, r = 0,
                    i, par, rootsLength;

                // Make sure roots is an `array`.
                roots = can.isArray(roots) ? roots : [roots || window];
                rootsLength = roots.length;

                if (!length) {
                    return roots[0];
                }

                // For each root, mark it as current.
                for (r; r < rootsLength; r++) {
                    current = roots[r];
                    par = undefined;

                    // Walk current to the 2nd to last object or until there
                    // is not a container.
                    for (i = 0; i < length && container(current); i++) {
                        par = current;
                        current = next(par, parts[i]);
                    }

                    // If we found property break cycle
                    if (par !== undefined && current !== undefined) {
                        break;
                    }
                }
                // Remove property from found container
                if (add === false && current !== undefined) {
                    delete par[parts[i - 1]];
                }
                // When adding property add it to the first root
                if (add === true && current === undefined) {
                    current = roots[0];

                    for (i = 0; i < length && container(current); i++) {
                        current = next(current, parts[i], true);
                    }
                }

                return current;
            },

            capitalize: function (s, cache) {
                // Used to make newId.
                return s.charAt(0).toUpperCase() + s.slice(1);
            },

            camelize: function (str) {
                return convert(str)
                    .replace(strHyphenMatch, function (match, chr) {
                        return chr ? chr.toUpperCase() : '';
                    });
            },

            hyphenate: function (str) {
                return convert(str)
                    .replace(strCamelMatch, function (str, offset) {
                        return str.charAt(0) + '-' + str.charAt(1)
                            .toLowerCase();
                        });
            },

            underscore: function (s) {
                return s.replace(strColons, '/')
                    .replace(strWords, '$1_$2')
                    .replace(strLowUp, '$1_$2')
                    .replace(strDash, '_')
                    .toLowerCase();
            },

            sub: function (str, data, remove) {
                var obs = [];

                str = str || '';

                obs.push(str.replace(strReplacer, function (whole, inside) {
                    // Convert inside to type.
                    var ob = this.getObject(inside, data, remove === true ? false : undefined);

                    if (ob === undefined || ob === null) {
                        obs = null;
                        return '';
                    }

                    // If a container, push into objs (which will return objects found).
                    if (container(ob) && obs) {
                        obs.push(ob);
                        return '';
                    }

                    return '' + ob;

                }));

                return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
            },

            undHash: strUndHash,

            replacer: strReplacer
        }; 
    }

    return {
        load: _load 
    };
});
