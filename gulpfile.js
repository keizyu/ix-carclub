const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    fileinclude = require('gulp-file-include'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    webpack = require('webpack-stream'),
    plumber = require('gulp-plumber'),
    htmlmin = require('gulp-htmlmin'),
    package = require('./package.json');


const banner = [
  '/*!\n' +
  ' * Last Build ' + new Date() + '\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('css', () => {

    return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));

});

gulp.task('js', () => {

  return gulp.src('src/js/scripts.js')
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(plumber())
    .pipe(webpack({
        mode: 'production'
    }))
    .pipe(babel({
        presets: [ '@babel/env' ]
    }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));

});

gulp.task('browser-sync', () => {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('bs-reload', () => {
    browserSync.reload();
});

gulp.task('fileinclude', () => {
    gulp.src([
        'src/html/**/*.html',
        '!src/html/_components/*.html' // ignore
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('start', ['css', 'js', 'browser-sync', 'fileinclude'], () => {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/html/**/*.html", ['fileinclude']);
});
