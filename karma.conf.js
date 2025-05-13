module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('@angular-devkit/build-angular/plugins/karma'),
      require('@chiragrupani/karma-chromium-edge-launcher'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter')
    ],
    client: {
      jasmine: {},
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ephemera'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        emitWarning: false,
        gloabl: {
          statements: 75,
          branches: 75,
          functions: 75,
          lines: 75,
          excludes: []
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Edge'],
    restartOnFileChange: true
  });
};
