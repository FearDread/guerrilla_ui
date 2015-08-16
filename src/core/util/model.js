/* Model Class Module */
$.GUI().create(function (GUI) {

  function Model () {
    var length, 
    	index = 0,
        argc = [].slice.call(arguments),
        func = argc.pop();

    if (argc && argc.length > 1) {
      length = argc.length;

      do {

        this[key] = argc[index];

        index++;
      } while(length--);

    }

  }

  return {
    load: Model,
    unload: function () {} 
  }

});
