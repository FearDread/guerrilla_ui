[![Buil d Status](https://travis-ci.org/FearDread/guerrilla_js.svg?branch=master)](https://travis-ci.org/FearDread/guerrilla_js) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) 
Guerrilla JS jQuery Framework
=============================
Guerrilla UI, <GUI>, a scalable, maintainable, extendable framework that lets you write even less and do even more! 

> It's The perfect framework for Multiple page Websites and [Single Page Applications.](http://en.wikipedia.org/wiki/Single-page_application)  Missing something you need?  GUI lets you extend the core and sandbox objects which can then be used in any of your modules or plugins.  Dynamically start, stop, load and unload modules that act as small parts of your whole application. 

## Overview

Guerrilla UI was inspired by [Articles](http://www.ubelly.com/2011/11/scalablejs/) and talks given by Nicholas Zakas which can be seen here ["Scalable JavaScript Application Architecture"](https://www.youtube.com/watch?v=vXjVFPosQHw) or with this [Slideshow](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture).

The GUI architecture is designed to make DOM manipulation, event handling, animations, extensability and networking even simpler.  With [jQuery](https://jquery.com) being its base library <GUI> takes the write less and do more philosiphy another step forward.
 
## Getting started ##

The easiest way to get started is to install Git and clone the repository:

``` bash
# Using Git, fetch only the latest commits.  You won't need the full history
# for your project.
git clone --depth 1 https://github.com/FearDread/guerrilla_js.git

# Move the repository to your own branch / project name.
mv guerrilla_js my-branch 

```

# How It all Works #
GUI implements many [javascript patterns](http://shichuan.github.io/javascript-patterns/) focusing on jQuery and jQuery plugin patterns. 


## Create a module

Now create a new module instance with its own sandbox:

```javascript
$.GUI().create( "myNewModule", function(gui) {
    
    return {
      load:    function(){ /*...*/ },
      unload: function(){ /*...*/ }
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
      
      myMethod();

    },
    unload: function() { 
      
      gui.log("Good Bye!");
    }
  };
};

$.GUI().create("App", App);
```

The `load` function is called by the framework when the module is supposed to
start. The `unload` function is called when the module has to shut down.

## Asynchronous initialization

You can also init or destroy you module in a asynchronous way:

```javascript
var MyAsyncModule = function(sandbox){
  return {
    init: function(options, done){
      doSomethingAsync(function(err){
        // ...
        done(err);
      });
    },
    destroy: function(done){
      doSomethingElseAsync(done);
    }
  };
};

core.register("myGreatModule", MyGreatModule);
core.start("myGreatModule", { done:function(){
  alert("now the initialization is done");
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

> For each module a separate sandbox will be created.

### Core

The core is responsible for starting and stopping your modules.
It also handles the messages by using the
[Publish/Subscribe (Mediator) pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

### Plugin

Plugins can extend the core or the sandbox with additional features.
For example you could extend the core with basic functionalities
(like DOM manipulation) or just aliases the features of a base library (e.g. jQuery).

## Features

+ multiple browser support
+ full access to jQuery
+ extendable with plugins
+ easy to add jQuery plugins
+ flow control
+ [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) & [CommonJS](http://www.commonjs.org/) support
+ framework-agnostic

### Extendable

Some of the current gui api features.

- `mvc` - MVC
- `state` - Finite State Machine
- `dom` - DOM manipulation
- `modulestate` - event emitter for `init` and `destroy`
- `utils` - helper methods like `mixin`, `uniqueId` etc.

You can easily define your own plugin (see plugin section).

# Download

## Latest stable 0.4.x version

- [guerrilla_js 0.3.7.tar.gz](https://github.com/FearDread/guerrilla_js/tarball)
- [guerrilla_js 0.3.7.zip](https://github.com/FearDread/guerrilla_js/zipball)

## Build process ##
# Uses Grunt CLI to concat, uglify and minify src/ libraries.

``` bash
# To run the build process with runtime environment built in.

# To run the build process without runtime environment. 

```

## License ##
Copyright © 2014 Garrett Haptonstall (@FearDread)  
Licensed under the MIT license.

...

## About Author ##
Garrett Haptonstall (@FearDread)

# Social
  - [Facebook](https://www.facebook.com/ghaptonstall)
  - [Twitter](https://twitter.com/G_HAP)
  - [Instagram](https://instagram.com#/ghap205)

## Cudos ##


# Technolegy Used
  - [jQuery](http://jquery.org)
  - [jQuery UI](http://jqueryui.com)
  - [Animate.css](https://daneden.github.io/animate.css/)
  - [Bootstrap](http://getbootstrap.com)
