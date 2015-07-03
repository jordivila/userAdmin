/*
Sharing JavaScript code between the browser and node.js
http://markdawson.tumblr.com/post/17212439857/sharing-javascript-code-between-the-browser-and
*/

/*
// when common.js is loaded, node wraps it in a function definition
// and passed in an exports object e.g.
//(function (exports, require, module, __filename, __dirname){
*/

(function() {

    var crossLayer = {
        queryParams: {
            seoRequest: "sr",
            appVersion: "av"
        },
        cookies:{
          currency: "curId",
          i18nLocale: "i18nL",
          theme: "th"
        }
    };


  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = crossLayer;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return crossLayer;
      });
    }
    else {
      window.crossLayer = crossLayer;
    }
  }

})();