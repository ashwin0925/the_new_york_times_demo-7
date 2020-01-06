const gulp = require("gulp");
const sourcemaps = require('gulp-sourcemaps');
const prettyError = require('gulp-prettyerror');
const autoprefixer = require('gulp-autoprefixer');

// Now that we've installed the terser package we can require it:
const terser = require("gulp-terser"),
  rename = require("gulp-rename"),
  browserSync = require('browser-sync').create(),
  eslint = require("gulp-eslint");

//Sass required element -  https://www.npmjs.com/package/gulp-sass
const sass = require('gulp-sass');
//Minify our css -  https://www.npmjs.com/package/gulp-uglifycss
const uglifycss = require('gulp-uglifycss');

// Create Sass task for compiling sass
gulp.task('sass', function(done) {
  gulp
    .src('./sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(prettyError())
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions']
      })
    )
    .pipe(uglifycss())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./build/css'));

  done();
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
});

gulp.task("scripts", function() {
  return gulp
    .src("./JS/*.js") // What files do we want gulp to consume?
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(terser()) // Call the terser function on these files
      // keep_fnames: false;     
      // topLevel: true;
    .pipe(rename({ extname: ".min.js" })) // Rename the uglified file
    .pipe(gulp.dest("./build/js")); // Where do we put the result?
});

gulp.task("reload", function() {
  browserSync.reload();
});

gulp.task('watch', function(done) {
  gulp.watch(["./js/*.js", "index.html"], gulp.series("scripts", "reload"));
  gulp.watch('sass/*.scss', gulp.series('sass'));
  done();
});


gulp.task("default", gulp.parallel("watch", "browser-sync"));
