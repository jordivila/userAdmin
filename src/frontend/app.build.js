({
	appDir: "./public",
	baseUrl: "./",
	dir: "./public-build",
	modules: [
        {
        	name: "scripts/modules/main"
        }
	],
	optimize: "none",//The biggest time drain is minification. If you are just doing builds as part of a dev workflow, then set optimize to "none".
	skipDirOptimize: true, //If doing a whole project optimization, but only want to minify the build layers specified in modules options and not the rest of the JS files in the build output directory, you can set skipDirOptimize to true.
	keepBuildDir: true, //Normally each run of a whole project optimization will delete the output build directory specified by dir for cleanliness. Some build options, like onBuildWrite, will modify the output directory in a way that is hazardous to do twice over the same files. However, if you are doing simple builds with no extra file transforms besides build layer minification, then you can set keepBuildDir to true to keep the build directory between runs. Then, only files that have changed between build runs will be copied.

	//Set config for finding 'jqueryui'. The path is relative
	//to the location of require-jquery.js.
	waitSeconds: 0,
	paths: {
		jquery: "./bower_components/jquery/jquery.min",
		jqueryui: "./bower_components/jquery-ui/ui/minified/jquery-ui.custom.min",
		domReady: "./bower_components/requirejs-domready/domReady",
		handlebars: "./bower_components/handlebars/handlebars.min",
		history: './bower_components/history.js/scripts/bundled/html5/jquery.history',

		/**************************************************************
					Globalize dependencies paths begin
		**************************************************************/
		cldr: "./bower_components/cldrjs/dist/cldr",
		// Unicode CLDR JSON data.
		"cldr-data": "./bower_components/cldr-data",
		// require.js plugin we'll use to fetch CLDR JSON content.
		json: "./bower_components/requirejs-plugins/src/json",
		// text is json's dependency.
		text: "./bower_components/requirejs-text/text",
		// Globalize.
		globalize: "./bower_components/globalize/dist/globalize"
		/**************************************************************
					Globalize dependencies paths end
		**************************************************************/

	},
	shim: {
		'jqueryui': {
			deps: ["jquery"]
		},
		'history': {
			deps: ["jquery"]
		},
	}
});