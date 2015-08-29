/* Extend Native Super Types */
/* Array */
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
/* Object */
Object.prototype.has = function(value){
  return this.hasOwnProperty(value);
}



