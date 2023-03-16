import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';//import squoosh from 'gulp-libsquoosh';
import webp  from 'gulp-webp';
//import del from 'del';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgstore from 'gulp-svgstore';

// Svg

export const sprite = () => {
 return gulp.src("source/img/iconesiz/*.svg")
 .pipe(svgstore())
 .pipe(rename("sprstore.svg"))
 .pipe(gulp.dest("source/img"));
}

// Image

export const optimizeImg = () => {
  return gulp.src('source/img/photo/*.{jpg,png}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img/photo'));
}

export const createWebp = () => {
  return gulp.src('source/img/photo/*.{jpg,png}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('build/img/photo'))
 }

// Copy

export const copy = (done) => {
 gulp.src([
 "source/fonts/*.{woff2,woff}",
 "source/*.ico",
 "source/img/**/*.{jpg,png,svg}",
 ], {
 base: "source"
 })
 .pipe(gulp.dest("build"))
 done();
}

// Html mimify

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts

export const scripts = () => {
  return gulp.src('source/js/script.js')
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'));
}

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Server

function server(done) {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Clean

const clean = () => {
  return del("build");
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html)).on('change', browser.reload);
}

export const build = gulp.series(
  //clean,
  copy,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
);

export default gulp.series(
  copy, html, styles, scripts, server, watcher
  );
