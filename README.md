[![Build Status](https://travis-ci.org/FearDread/guerrilla_js.svg?branch=master)](https://travis-ci.org/FearDread/guerrilla_js) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [!License](https://img.shields.io/packagist/l/doctrine/orm.svg)]
Guerrilla JS jQuery Framework
=============================
Guerrilla UI, <GUI>, a scalable, maintainable, extendable framework that lets you write even less and do even more! 

> It's The perfect framework for Multiple page Websites and [Single Page Applications.](http://en.wikipedia.org/wiki/Single-page_application)  Missing something you need?  GUI lets you extend the core and sandbox objects which can then be used in any of your modules or plugins.  Dynamically start, stop, load and unload modules that act as small parts of your whole application. 

## Overview

Guerrilla UI was inspired by [Articles](http://www.ubelly.com/2011/11/scalablejs/) and talks given by Nicholas Zakas which can be seen here ["Scalable JavaScript Application Architecture"](https://www.youtube.com/watch?v=vXjVFPosQHw) or with this [Slideshow](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture).

The GUI architecture is designed to make DOM manipulation, event handling, animations, extensability and networking even simpler.  With [jQuery](https://jquery.com) being its base library <GUI> takes the write less and do more philosiphy another step forward.

## Contributing
Guerrilla UI is now open for contributions and looking for javascript programmers to help expand the default sandbox api!  Email author FearDread (ghaptonstall@gmail.com) or message via github to get in touch and become a part of this amazing project!  Once in contact, contribution guidlines will be given and explained.
 
## Getting started ##

The easiest way to get started is to install Git and clone the repository:

``` bash
# Using Git, fetch only the latest commits.  You won't need the full history
# for your project.
git clone --depth 1 https://github.com/FearDread/guerrilla_js.git

# Move the repository to your own branch / project name.
mv guerrilla_js my-branch 

```
Link `guerrilla-ui.js` or `guerrilla-ui.min.js` in your HTML file (make sure to include latest version of jQuery as its required by GUI):

```html
<script src="/js/jquery.min.js"></script>
<script src="/js/jquery-ui.min.js"></script>

<script src="/js/guerrilla-ui.js"></script>
<script src="/js/guerrilla-ui.min.js"></script>
```

# How It all Works #
GUI implements many [javascript patterns](http://shichuan.github.io/javascript-patterns/) focusing on jQuery and jQuery plugin patterns. 


## Create a module

Now create a new module instance with its own sandbox:

```javascript
$.GUI().create( "myNewModule", function(gui) {
    
    return {
        load: function() {
    
        },
        unload: function() { 
       
        }
    };
});
```

Your module is a function that takes the sandbox api (gui) as a parameter and returns a new object that uses two functions to handle its activation `load` and destruction `unload`, the latter function is optional.

```javascript
var App = function(gui) {

    function myMethod() {
        gui.log("Hello World");
    }
  
    return {
        load: function() {             
            var mediaHandler;

            myMethod();
            mediaHandler = new gui.ui.media({
                in: function(){},
                out: function(){},
                both: function(){}
            });
            
            mediaHandler();
        },
        unload: function() {  
            gui.log("Good Bye!");
        }
    };
};

$.GUI().create("App", App).start();
```

The `load` function is called by the framework when the module is supposed to
start. The `unload` function is called when the module has to shut down.

## Asynchronous initialization

You can also load or unload your module in a asynchronous way:

```javascript
var asyncModule = function(gui) {
    return {
        load: function(options, done) {
            asyncTask(function(err) {
                // ...
                done(err);
            });
        },
        unload: function(done) {
            anotherAsyncTask(done);
        }
    };
};

$.GUI().create("asyncModule", asyncModule)
    .start("asyncModule", { done: function() {
        alert('done initializing!');
    }});
```

### Modules

A module is a completely independent part of your application.
It has absolutely no reference to another piece of the app.
The only thing the module knows is your sandbox.
The sandbox is used to communicate with other parts of the application.

### Sandbox
The <GUI> Sandbox API comes with alot of capabilities out of the box.  It uses the [faccade pattern](https://en.wikipedia.org/wiki/Facade_pattern).  That way you can hide the features provided by the core and only show a well defined custom static long term API to your modules.

> This is actually one of the most important concepts for creating
mainainable applications.

> For each module a separate sandbox instance will be created.

### Core

The GUI core object is responsible for loading and unloading your modules.
It also handles the messages by using the
[Publish/Subscribe (Mediator) pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) with the Broker.

## Starting Modules

After your modules are created, start your modules:

```javascript
$.GUI()
    .start("moduleA")
    .start("moduleB", function(err) {
        // 'anOtherModule' is running now
    });
```

### Various Start Options

With <GUI> you can start multiple instances of the same module using `instanceId`:

```javascript
$.GUI().start("moduleA", {instanceId: "moduleInstanceA"});
$.GUI().start("moduleA", {instanceId: "moduleInstanceB"});
```

You can also attach custom data to the `options` property and it will be accessible within your modules:

```javascript
$.GUI().create("module", function(gui) {
  
    return {
        load: function(opts) {
            (opts.myProp === "someValue")  // true

            gui.each(opts.anotherProp, function(k, v) {
                gui.log("key :" + k);
                gui.log("value :", v);
            });
        },
        unload: function() {}
    };
}).start("moduleA", {
    instanceId: "testing",
    options: {
        myProp: "someValue",
        anotherProp: ["data1", "data2"],
        someObj: {}
    }
});
```

If you want to just start all modules with no custom instances simply call start with no options.

```javascript
$.GUI().start();
```

To start specific modules at once you can pass an array of the module names to start.

```javascript
$.GUI().start(["moduleA","moduleB"]);
```

You can also pass a callback function:

```javascript
$.GUI().start(function() {
  // do something when all modules initialized
});
```

If you need to you can create your own sandbox to use for a module:

```javascript
var newSandbox = function() {};

$.GUI().start("moduleA", {sandbox: newSandbox});
```

## Stopping

Simply call

```javascript
$.GUI().stop("moduleB");
$.GUI().stop(); // stops all running instances
```

## Broker Publish / Subscribe

If a module needs to communicate with other modules, you can use the `fire` and `add` methods the Broker provides.

### fire

The `fire` function takes three parameters, the last one is optional:
- `channel` : the channel name you want to emit to
- `data`  : the data itself
- `cb`    : callback method

The fire function is accessible through the gui sandbox:

```javascript
gui.fire("myChannle", myDataObj);

gui.fire("anotherChannel", {prop:value}, function() {
  gui.log("Called after event fired.");
});
```

### add
A handler for a subscription could look like this:

```javascript
var handler = function(data, channel) {
    switch(channel) {
        case "channelA":
            gui.fire("channelA", process(data));
            break;
        
        case "channelB":
            // do something else;
            break;
    }
};
```

... and it can listen to one or more channels:

```javascript
sub1 = gui.add("channelA", handler);
sub2 = gui.add("channelB", handler);
```
Or just do it at all once:

```javascript
gui.add({channelA: cbA, channelB: cbB, channelC: function() {
        // do something
    }
});
```

You can also subscribe to several channels at once:

```javascript
gui.add(["ChannelA", "ChannelB"], function() {
    // do something
});
```

#### listen and ignore

A subscription can be detached and attached again:

```javascript
sub.ignore(); // don't listen any more
sub.listen(); // receive upcoming new messages
```

#### remove

You can unsubscribe a function from a channel

```javascript
gui.remove("channelA", callback);
```

And you can remove a callback function from all channels

```javascript
gui.remove(callback);
```

Or remove all subscriptions from a channel:

```javascript
gui.remove("channelName");
```

## Extendable

### Plugin & jQuery Plugins

Plugins can extend the <GUI> core or the sandbox with additional features.
For example you could extend the core with basic functionalities
(like DOM manipulation) or just aliases the features of the base jQuery library.

To create a plugin and start extending both the core and or sandbox <GUI> has the `use` method which accepts a function and returns an object with the `load` function and the optional `unload` function similar to the `create` method.

```javascript
$.GUI().use(function(core) {
    // extend the core
    core.myNewMethod = function() {
        // do something new
    }

    return {
        load: function(sandbox) {
            // extend sandbox api
            sandbox.myNewPlugin = function() {

            }

            sandbox.anotherObject = {};
        },
        unload: function() {}
    }
});
```

<GUI> lets you easily write your own jQuery plugins and attach them to the jQuery namespace easily with the `fn` method.

```javascript
$.GUI().create("jQueryPlugin", function(gui) {

    function scrollPlugin() {}

    scrollPlugin.prototype.init = function($el, opts) {
        window.scrollTo($el);
    };

    return {
        // attach to jQuery namespace
        fn: function($el, options) {
            // init plugin here
            return new scrollPlugin($el, options);
        }
    };
}).start("jQueryPlugin");

```

## Features

+ multiple browser support
+ full access to jQuery
+ extendable with plugins
+ easy to add jQuery plugins
+ flow control
+ [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) & [CommonJS](http://www.commonjs.org/) support
+ framework-agnostic

Some of the current <gui> api features.

- `dom` - DOM manipulation and `event` handling
- `mvc` - MVC - `model`, `view`, `controller`
- `ui` - Special features like `charm` and `media`
- `net` - Supplies a `router` for your modules
- `lang` - Additional native type (`Array`, `Object`, etc) helper functions
- `utils` - Helper methods like `mixin`, `throttle`, `slugify` etc.
- `run` - Object with Flow Control methods such as `series`, `parallel` and more
- `cellar` - Easy to use storage api for `localStorage` and `sessionStorage`

# Download

- [guerrilla_js.zip](https://github.com/FearDread/guerrilla_js/archive/master.zip)

## Build process ##
###  Uses Grunt CLI to concat, uglify and minify src/ libraries.

``` bash
# To run the build process simply add any new src file paths.
# Then run
grunt -v

```

## License ##
Copyright © 2014 Garrett Haptonstall (@FearDread)  
Licensed under the MIT [license](https://github.com/FearDread/guerrilla_js/blob/master/LICENSE).

...

## About Author ##
Garrett Haptonstall [(@FearDread)](https://github.com/FearDread)

### Social
  - [Facebook](https://www.facebook.com/ghaptonstall)
  - [Twitter](https://twitter.com/G_HAP)
  - [Instagram](https://instagram.com#/ghap205)

### Technolegy Used
  - [jQuery](http://jquery.org)
  - [jQuery UI](http://jqueryui.com)
  - [Animate.css](https://daneden.github.io/animate.css/)
  - [Bootstrap](http://getbootstrap.com)

#### Cudos
> The <GUI> framework is a based on various softwares modified to meet the guerrilla ui needs.
  - [Canjs](https://github.com/bitovi/canjs)
  - [YUI3](https://github.com/yui/yui3)
  - [ScaleApp](https://github.com/flosse/scaleApp)

