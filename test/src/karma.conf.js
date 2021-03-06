// Karma configuration
// Generated on Sun Jul 23 2017 04:06:59 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  
    var customBrowsers = ['ChromeHeadless'];

    if (process.env.TRAVIS) {
      customBrowsers = ['ChromeHeadless'];
    }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'src/js/*.js', 'src/lib/*.js', 'test/src/karma/*.spec.js', 'test/src/test_data/*.dat.js', 'test/src/test_util/*.js'
    ],


    // list of files to exclude
	exclude: [
		'src/js/popup.js', 'src/js/background.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
     'src/js/*.js':['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      reporters: [
          {type: 'text'},
          {type: 'lcov', dir:'test/coverage/karma'}
        ]
    },

    mochaReporter: {
      output: 'full'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    customLaunchers:{
      ChromeDebug: {
        base: 'Chrome',
        flags: [ '--remote-debugging-port=9222'],
        debug:true
      },
      ChromeHeadlessDebug: {
        base: 'ChromeHeadless',
        flags: [ '--remote-debugging-port=9222'],
        debug:true
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: customBrowsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  })
}
