var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');


function jsBundle(options) {
  return browserify({
      entries: options.index,
      extensions: ['.jsx', 'js'],
      debug: false
    })
    .transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(source(options.output.file))
    //.pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest(options.output.dir));
}

gulp.task('html-client', function() {
  return gulp.src('rpsls-client/index.html')
    .pipe(gulp.dest('dist/server/static/'));
});

gulp.task('compress', function() {
  return gulp.src('scripts/*.js').pipe(uglify()).pipe(gulp.dest('dist'));
});

gulp.task('js-app', function() {
  return jsBundle({
    index: './js/app.js',
    output: {
      file: 'bundle.min.js',
      dir: 'scripts/'
    }
  });
});

gulp.task('js-app-watch', ['js-app'], function() {
  gulp.watch('js/**/*.js', ['js-app']);
});

/*
gulp.task('client-spec', function() {
  return jsBundle({
    index: 'specs/rpsls-client/index.js',
    output: {
      file: 'client-spec.js',
      dir: 'specs/bundles/'
    }
  });
});
*/

gulp.task('default', ['js-app']);
