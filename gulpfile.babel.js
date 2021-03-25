// Set Gulp variables
const { src, dest, watch, series, parallel } = require('gulp');

// Import config from package.json
const pkgJSON = require('./package.json');

// CSS related plugins
const sass = require('gulp-dart-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      csso = require('gulp-csso');

// JS related plugins
const babel = require('gulp-babel'),
      uglify = require('gulp-uglify');

// Utility plugins
const del = require('del'),
      rename = require('gulp-rename'),
      imagemin = require('gulp-imagemin'),
      sourcemaps = require('gulp-sourcemaps'),
      mode = require('gulp-mode')();

// Set browser sync variable
const browserSync = require('browser-sync').create();

// File paths
const scssSrc = './src/scss/',
      jsSrc = './src/js/',
      imgSrc = './src/images/',
      fontSrc = './src/fonts/',
      devDes = `../${pkgJSON.config.localserverpath}${pkgJSON.config.themename}/`,
      prodDes = `./${pkgJSON.config.productionserverpath}${pkgJSON.config.themename}/`;

// Watch files
const watchStyles = scssSrc + '**/*.scss',
      watchJs = jsSrc + '**/*.js',
      watchImg = imgSrc + '**/*.{png,jpg,jpeg,gif,svg}',
      watchFont = fontSrc + '**/*.{svg,eot,ttf,woff,woff2}',
      watchScreenshot = './src/screenshot.{png,jpg}',
      watchPHP = './src/**/*.php';


// clean tasks
// =================================================
const clean = () => {
  return del(['prodDes']);
}

const cleanImages = () => {
  return del(['prodDes/images']);
}

const cleanFonts = () => {
  return del(['prodDes/fonts']);
}

// CSS Task
// =================================================
const cssTask = () => {
  return src(scssSrc + 'main.scss')
    .pipe(mode.development( sourcemaps.init() ))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('style.css'))
    .pipe(mode.production( csso() ))
    .pipe(mode.production( dest(prodDes) ))
    .pipe(mode.development( sourcemaps.write() ))
    .pipe(dest(devDes))
    .pipe(mode.development( browserSync.stream())
  );
}

// Javascript Task
// =================================================
const jsTask = () => {
  return src(jsSrc + 'script.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(dest(devDes + 'js'))
  .pipe(mode.production( uglify() ))
  .pipe(mode.production( dest(prodDes + 'js') )
  );
}

// Image Task
// =================================================
const imageTask = () => {
  return src(watchImg)
    .pipe(imagemin())
    .pipe(mode.development( dest( devDes + 'images') ))
    .pipe(mode.production( dest(prodDes + 'images') )
  );
}

// Fonts Task
// =================================================
const copyFonts = () => {
  return src(watchFont)
    .pipe(mode.development( dest(devDes + 'fonts') ))
    .pipe(mode.production( dest(prodDes + 'fonts') )
  );
}

// Screenshot Task
// =================================================
const screenshotTask = () => {
  return src(watchScreenshot)
    .pipe(mode.development( dest(devDes) ))
    .pipe(mode.production( dest(prodDes) )
  );
}

// PHP Task
// =================================================
const phpTask = () => {
  return src(watchPHP)
    .pipe(mode.development( dest(devDes) ))
    .pipe(mode.production( dest(prodDes) )
  );
}

// Reload Task
// =================================================
function reload(done) {
  browserSync.reload();

	done();
}

// Server Task
// =================================================
const startServer = (done) => {
  browserSync.init({
    open: 'local',
    proxy: `${pkgJSON.config.sitename}.local`,
    port: 8080
  });

  done();
}

// Watch Task
// =================================================
const watchTask = (done) => {
  watch(watchStyles, cssTask);
  watch(watchJs, series(jsTask, reload));
  watch(watchImg, series(cleanImages, imageTask, reload));
  watch(watchFont, series(cleanFonts, copyFonts, reload));
  watch(watchScreenshot, screenshotTask);
  watch(watchPHP, series(phpTask, reload));

  done();
}

// Exports
// =================================================
// Run gulp to start development server
exports.default = series(
  parallel(
    cssTask,
    jsTask,
    imageTask,
    copyFonts,
    screenshotTask,
    phpTask
  ),
  startServer,
  watchTask
);

// Run gulp build to create production files
exports.build = series(
  clean,
  parallel(
    cssTask,
    jsTask,
    imageTask,
    copyFonts,
    screenshotTask,
    phpTask
  )
);