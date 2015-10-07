/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Event, dom & element events api * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    /**
     * A custom event handler for dom elements
    **/
    Event = (function() {

        function Event() {}

        /**
         * Determine current mobile device for passed user agent 
         *
         * @param agent {string} - the user agent currently in use
         * @return {boolean}
        **/
        Event.prototype.isMobile = function(agent) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
        };

        /**
         * Create new event handler
         *
         * @param event {string} - name of the event
         * @param bubble {boolean} - whether or not to bubble the event in stack
         * @param cancel {boolean} - boolean value to determine event cancellation
         * @param detail {object} - optional data object
         * @return event {object} - new event
        **/
        Event.prototype.create = function(event, bubble, cancel, detail) {
            var customEvent;

            if (!bubble || bubble === null) {
                bubble = false;
            }

            if (!cancel || cancel === null) {
                cancel = false;
            }

            if (!detail || detail === null) {
                detail = null;
            }

            if (document.createEvent !== null) {

                customEvent = document.createEvent('CustomEvent');
                customEvent.initCustomEvent(event, bubble, cancel, detail);

            } else if (document.createEventObject !== null) {

                customEvent = document.createEventObject();
                customEvent.eventType = event;

            } else {

                customEvent.eventName = event;
            }

            return customEvent;
        };

        /**
         * Trigger specified event for given element
         *
         * @param elem {object} - the element with event handler
         * @param event {string} - name of the event to fire
         * @return {function} - calls event handler 
        **/
        Event.prototype.fire = function(elem, event) {
            if (elem.dispatchEvent && elem.dispatchEvent !== null) {

                return elem.dispatchEvent(event);

            } else if (event in (elem !== null)) {

                return elem[event]();

            } else if (("on" + event) in (elem !== null)) {

                return elem["on" + event]();
            }
        };

        Event.prototype.add = function(elem, event, fn) {
            var newEvent;

            if (elem.addEventListener !== null) {

                return elem.addEventListener(event, fn, false);

            } else if (elem.attachEvent !== null) {

                return elem.attachEvent("on" + event, fn);

            } else {
                newEvent = elem[event] = fn;

                return newEvent;
            }
        };

        Event.prototype.remove = function(elem, event, fn) {
            if (elem.removeEventListener !== null) {

                return elem.removeEventListener(event, fn, false);

            } else if (elem.detachEvent !== null) {

                return elem.detachEvent("on" + event, fn);

            } else {

                return delete elem[event];
            }
        };

        Event.prototype.innerHeight = function() {
            if ('innerHeight' in window) {

                return window.innerHeight;

            } else {

                return document.documentElement.clientHeight;
            }
        };

        return Event;

    })();

    return {
        
        load: function(api) {

            api.dom.event = new Event();
        },
        unload: function() {}
    };
});
