/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Background Loaded jQuery plugin * 
* ---------------------------------------- */
$.GUI().create('background', function (gui) {

    return {

        fn: function($el, options) {
            var defaults, settings;

            defaults = {
                afterLoaded: function() {
                    this.addClass('bg-loaded');
                }
            };

            settings = gui.utils.merge({}, defaults, options);

            $el.each(function () {
                var $this = gui.$(this), bgImages;

                bgImages = window.getComputedStyle($this.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');

                $this.data('loaded-count', 0);

                gui.each(bgImages, function (key, value) {
                    var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

                    gui.$('<img/>').attr('src', img).load(function () {
                        $(this).remove(); // prevent memory leaks

                        $this.data('loaded-count', $this.data('loaded-count') + 1);

                        if ($this.data('loaded-count') >= bgImages.length) {
                            settings.afterLoaded.call($this);
                        }

                    });

                });

            });

        }

    };

}).start('background');
