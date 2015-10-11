[![Build Status](https://travis-ci.org/FearDread/guerrilla_js.svg?branch=master)](https://travis-ci.org/FearDread/guerrilla_js) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![MIT License](https://img.shields.io/packagist/l/doctrine/orm.svg)](LICENSE)
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

## Create a new module
A module is a completely independent part of your application.
It has absolutely no reference to another piece of the app.
The only thing the module knows is your sandbox.
The sandbox is used to communicate with other parts of the application.

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

## Load Asynchronously

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

### Guerrilla API 
The <GUI> Sandbox API comes with alot of capabilities out of the box.  It uses the [faccade pattern](https://en.wikipedia.org/wiki/Facade_pattern).  That way you can hide the features provided by the core and only show a well defined custom static long term API to your modules.

> This is actually one of the most important concepts for creating
mainainable applications.
