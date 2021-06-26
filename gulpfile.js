"use strict";

const gulp          = require( 'gulp' ),
      webpack       = require( 'webpack-stream' ),
      sass          = require( 'gulp-sass' ),
      autoprefixer  = require( 'gulp-autoprefixer' ),
      browsersync   = require( 'browser-sync' );

const dist = "./dist/";

sass.compiler = require('node-sass');

gulp.task("html", () => {
    return gulp.src("./src/index.php")
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task('sass', () => {
  return gulp.src('./src/sass/default/**/*.sass')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer(['last 50 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest(dist + "/css/default"))
  .on("end", browsersync.reload);
});

gulp.task('sass-light-theme', () => {
  return gulp.src('./src/sass/theme-color/light/**/*.sass')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer(['last 50 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest(dist + "/css/theme-color"))
  .on("end", browsersync.reload);
});

gulp.task('sass-dark-theme', () => {
  return gulp.src('./src/sass/theme-color/dark/**/*.sass')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer(['last 50 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest(dist + "/css/theme-color"))
  .on("end", browsersync.reload);
});

gulp.task("js", () => {
  return gulp.src("./src/js/main.js")
  .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'main.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
            presets: [['@babel/preset-env', {
              debug: true,
              corejs: 3,
              useBuiltIns: "usage"
            }]]
          }
        }
      }
    ]
  }
}))
  .pipe(gulp.dest(dist))
  .on("end", browsersync.reload);
});

gulp.task("fonts", () => {
  return gulp.src("./src/assets/fonts/**/*.*")
  .pipe(gulp.dest(dist + "/assets/fonts/"))
  .on("end", browsersync.reload);
});

gulp.task("images", () => {
  return gulp.src("./src/assets/images/**/*.*")
  .pipe(gulp.dest(dist + "/assets/images/"))
  .on("end", browsersync.reload);
});

gulp.task("watch", () => {

  browsersync.init({
    proxy: "resume-web.loc",
    notify: true
  });

  gulp.watch("./src/index.php", gulp.parallel("html"));
  gulp.watch("./src/assets", gulp.parallel("fonts"));
  gulp.watch("./src/assets", gulp.parallel("images"));
  gulp.watch("./src/sass/default/**/*.*", gulp.parallel("sass"));
  gulp.watch("./src/sass/theme-color/light/**/*.*", gulp.parallel("sass-light-theme"));
  gulp.watch("./src/sass/theme-color/dark/**/*.*", gulp.parallel("sass-dark-theme"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
});

gulp.task("build", gulp.parallel("html", "images", "fonts", "js", "sass", "sass-light-theme", "sass-dark-theme"));

gulp.task("build-prod-js", () => {
  return gulp.src("./src/js/main.js")
  .pipe(webpack({
    mode: 'production',
    output: {
      filename: 'script.js'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
            presets: [['@babel/preset-env', {
              corejs: 3,
              useBuiltIns: "usage"
            }]]
          }
        }
      }
    ]
  }
}))
  .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));
