/*
 * QUnit - A JavaScript Unit Testing Framework
 * 
 * http://docs.jquery.com/QUnit
 *
 * Copyright (c) 2009 John Resig, Jörn Zaefferer
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */

(function(window) {

var QUnit = {

	// call on start of module test to prepend name to all tests
	module: function(name, testEnvironment) {
		config.currentModule = name;

		synchronize(function() {
			if ( config.previousModule ) {
				QUnit.moduleDone( config.currentModule, config.moduleStats.bad, config.moduleStats.all );
			}

			config.previousModule = config.currentModule;
			config.currentModule = name;
			config.moduleTestEnvironment = testEnvironment;
			config.moduleStats = { all: 0, bad: 0 };

			QUnit.moduleStart( name, testEnvironment );
		});
	},

	asyncTest: function(testName, expected, callback) {
		if ( arguments.length === 2 ) {
			callback = expected;
			expected = 0;
		}

		QUnit.test(testName, expected, callback, true);
	},
	
	test: function(testName, expected, callback, async) {
		var name = '<span class="test-name">' + testName + '</span>', testEnvironment, testEnvironmentArg;

		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}
		// is 2nd argument a testEnvironment?
		if ( expected && typeof expected === 'object') {
			testEnvironmentArg =  expected;
			expected = null;
		}

		if ( config.currentModule ) {
			name = '<span class="module-name">' + config.currentModule + "</span>: " + name;
		}

		if ( !validTest(config.currentModule + ": 