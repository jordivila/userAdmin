/*!
 * modernizr v3.0.0-alpha.3
 * Build http://v3.modernizr.com/download/#-es5array-es5object-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Alexander Farkas
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

; (function (window, document, undefined) {
    var classes = [];


    var tests = [];


    var ModernizrProto = {
        // The current version, dummy
        _version: '3.0.0-alpha.3',

        // Any settings that don't work as separate modules
        // can go in here as configuration.
        _config: {
            'classPrefix': '',
            'enableClasses': true,
            'enableJSClass': true,
            'usePrefixes': true
        },

        // Queue of tests
        _q: [],

        // Stub these for people who are listening
        on: function (test, cb) {
            // I don't really think people should do this, but we can
            // safe guard it a bit.
            // -- NOTE:: this gets WAY overridden in src/addTest for
            // actual async tests. This is in case people listen to
            // synchronous tests. I would leave it out, but the code
            // to *disallow* sync tests in the real version of this
            // function is actually larger than this.
            var self = this;
            setTimeout(function () {
                cb(self[test]);
            }, 0);
        },

        addTest: function (name, fn, options) {
            tests.push({ name: name, fn: fn, options: options });
        },

        addAsyncTest: function (fn) {
            tests.push({ name: null, fn: fn });
        }
    };



    // Fake some of Object.create
    // so we can force non test results
    // to be non "own" properties.
    var Modernizr = function () { };
    Modernizr.prototype = ModernizrProto;

    // Leak modernizr globally when you `require` it
    // rather than force it here.
    // Overwrite name so constructor name is nicer :D
    Modernizr = new Modernizr();


    /*!
    {
      "name": "ES5 Array",
      "property": "es5array",
      "notes": [{
        "name": "ECMAScript 5.1 Language Specification",
        "href": "http://www.ecma-international.org/ecma-262/5.1/"
      }],
      "polyfills": ["es5shim"],
      "authors": ["Ron Waldon (@jokeyrhyme)"],
      "tags": ["es5"]
    }
    !*/
    /* DOC
    Check if browser implements ECMAScript 5 Array per specification.
    */

    Modernizr.addTest('es5array', function () {
        return !!(Array.prototype &&
          Array.prototype.every &&
          Array.prototype.filter &&
          Array.prototype.forEach &&
          Array.prototype.indexOf &&
          Array.prototype.lastIndexOf &&
          Array.prototype.map &&
          Array.prototype.some &&
          Array.prototype.reduce &&
          Array.prototype.reduceRight &&
          Array.isArray);
    });

    /*!
    {
      "name": "ES5 Object",
      "property": "es5object",
      "notes": [{
        "name": "ECMAScript 5.1 Language Specification",
        "href": "http://www.ecma-international.org/ecma-262/5.1/"
      }],
      "polyfills": ["es5shim", "es5sham"],
      "authors": ["Ron Waldon (@jokeyrhyme)"],
      "tags": ["es5"]
    }
    !*/
    /* DOC
    Check if browser implements ECMAScript 5 Object per specification.
    */

    Modernizr.addTest('es5object', function () {
        return !!(Object.keys &&
          Object.create &&
          Object.getPrototypeOf &&
          Object.getOwnPropertyNames &&
          Object.isSealed &&
          Object.isFrozen &&
          Object.isExtensible &&
          Object.getOwnPropertyDescriptor &&
          Object.defineProperty &&
          Object.defineProperties &&
          Object.seal &&
          Object.freeze &&
          Object.preventExtensions);
    });


    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is(obj, type) {
        return typeof obj === type;
    }
  

    // Run through all tests and detect their support in the current UA.
    function testRunner() {
        var featureNames;
        var feature;
        var aliasIdx;
        var result;
        var nameIdx;
        var featureName;
        var featureNameSplit;

        for (var featureIdx in tests) {
            featureNames = [];
            feature = tests[featureIdx];
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            //
            //   If there is no name, it's an 'async' test that is run,
            //   but not directly added to the object. That should
            //   be done with a post-run addTest call.
            if (feature.name) {
                featureNames.push(feature.name.toLowerCase());

                if (feature.options && feature.options.aliases && feature.options.aliases.length) {
                    // Add all the aliases into the names list
                    for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
                        featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
                    }
                }
            }

            // Run the test, or use the raw value if it's not a function
            result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


            // Set each of the names on the Modernizr object
            for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
                featureName = featureNames[nameIdx];
                // Support dot properties as sub tests. We don't do checking to make sure
                // that the implied parent tests have been added. You must call them in
                // order (either in the test, or make the parent test a dependency).
                //
                // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
                // hashtag famous last words
                featureNameSplit = featureName.split('.');

                if (featureNameSplit.length === 1) {
                    Modernizr[featureNameSplit[0]] = result;
                } else {
                    // cast to a Boolean, if not one already
                    /* jshint -W053 */
                    if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
                        Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
                    }

                    Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
                }

                classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
            }
        }
    }

    

    var docElement = document.documentElement;


    // Pass in an and array of class names, e.g.:
    //  ['no-webp', 'borderradius', ...]
    function setClasses(classes) {
        var className = docElement.className;
        var classPrefix = Modernizr._config.classPrefix || '';

        // Change `no-js` to `js` (we do this independently of the `enableClasses`
        // option)
        // Handle classPrefix on this too
        if (Modernizr._config.enableJSClass) {
            var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
            className = className.replace(reJS, '$1' + classPrefix + 'js$2');
        }

        if (Modernizr._config.enableClasses) {
            // Add the new classes
            className += ' ' + classPrefix + classes.join(' ' + classPrefix);
            docElement.className = className;
        }

    }

    

    // Run each test
    testRunner();

    // Remove the "no-js" class if it exists
    setClasses(classes);

    delete ModernizrProto.addTest;
    delete ModernizrProto.addAsyncTest;

    // Run the things that are supposed to run after the tests
    for (var i = 0; i < Modernizr._q.length; i++) {
        Modernizr._q[i]();
    }

    // Leak Modernizr namespace
    window.Modernizr = Modernizr;

    

})(window, document);