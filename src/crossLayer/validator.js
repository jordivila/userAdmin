//http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/

(function() {

  var Validator = (function() {

    var Validator = function(options) {
      //...
    };

    Validator.prototype.foo = function foo() {
      //...
    };

    return Validator;
  })();


  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Validator;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return Validator;
      });
    }
    else {
      window.Validator = Validator;
    }
  }

})();
