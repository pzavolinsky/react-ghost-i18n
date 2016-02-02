"use strict"

var gulp        = require('gulp');
var babel       = require('gulp-babel');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var jasmine     = require('gulp-jasmine');
var gutil       = require('gulp-util');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var del         = require('del');

gulp.task('default', ['uglify']);

gulp.task('clean', function(cb) { del('./dist', cb); });

gulp.task('compile', ['clean'], function() {
  return gulp.src('./src/*.jsx')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle', ['compile'], function () {
  return browserify({ entries: ['./dist/react-ghost-i18n.js'] })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('react-ghost-i18n-browser.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', ['bundle'], function () {
  gulp.src('./dist/react-ghost-i18n-browser.js')
    .pipe(uglify().on('error', gutil.log.bind(gutil, 'Uglify Error')))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['uglify'], function() {
  return gulp.watch('./src/**/*.jsx', ['uglify']);
});

gulp.task('test-compile', ['compile'], function () {
  return gulp.src('./spec/**/*spec.jsx')
    .pipe(babel())
    .pipe(gulp.dest('./dist/spec'));
  gulp.src('./dist/spec/**/*.js')
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});

gulp.task('test', ['test-compile'], function () {
  return gulp.src('./dist/spec/**/*.js')
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});
