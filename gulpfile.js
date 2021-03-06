'use strict';

// Requires
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;



// Lint JavaScript
gulp.task('lint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


// Optimize images
gulp.task('images', function() {
  gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});


// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
    'app/styles/**/*.sass',
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/styles'));
    // Concatenate and minify styles
    // .pipe($.if('*.css', $.cssnano()))
    // .pipe($.size({title: 'styles'}))
    // .pipe($.sourcemaps.write('./'))
    // .pipe(gulp.dest('dist/styles'));
});


// Scan the HTML for assets and optimize them
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe($.useref({searchPath: '{.tmp,app}'}))

    // Concatenate and minify styles and scripts
    // !!! Requires styles and scripts to be inside useref build blocks !!!
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))

    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin()))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


// Copy all files at the root level (app)
gulp.task('copy', function () {
  return gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});



// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Copy json to dist
gulp.task('json', function () {
  return gulp.src(['app/json/**'])
    .pipe(gulp.dest('dist/json'))
    .pipe($.size({title: 'json'}));
});

// Copy data to dist
gulp.task('data', function () {
  return gulp.src(['app/data/**'])
    .pipe(gulp.dest('dist/data'))
    .pipe($.size({title: 'data'}));
});

// Watch files for changes & reload
gulp.task('serve', ['styles'], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.{sass,scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint']);
  gulp.watch(['app/images/**/*'], reload);
});



// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist'
  });
});



// Default task - Build production files
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['html', 'images', 'fonts', 'json', 'data', 'copy'], cb);
});

