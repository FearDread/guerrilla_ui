/* Extend Native Super Types */
Array.prototype.has = function(value){
  var index = 0,
      length = this.length;

  while(length--){
    if(this[index] == value){
      return true;
    }

    index++;
  }
  return false;
}



