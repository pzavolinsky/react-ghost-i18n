"use strict"

var gulp        = require('gulp');
var babel       = require('gulp-babel');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var insert      = require('gulp-insert');
var runSequence = require('run-sequence');
var del         = require('del');

gulp.task('default', ['build']);

gulp.task('clean', function(cb) { del('./dist', cb); });

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    ['uglify-std', 'build-common'],
    cb
  );
});

gulp.task('build-std', function() {
  return gulp.src('./src/react-ghost-i18n.jsx')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});
gulp.task('uglify-std', ['build-std'], function() {
  return gulp.src('./dist/react-ghost-i18n.js')
    .pipe(uglify())
    .pipe(rename('react-ghost-i18n.min.js'))
    .pipe(gulp.dest('./dist'));
});
gulp.task('build-common', function() {
  return gulp.src('./src/react-ghost-i18n.jsx')
    .pipe(insert.prepend('var React = require("react");\n'))
    .pipe(insert.append('\nmodule.exports = I18n;'))
    .pipe(babel())
    .pipe(rename('react-ghost-i18n-common.js'))
    .pipe(gulp.dest('./dist'));
});
