const browserSync = require("browser-sync").create();
const gulp = require("gulp");
const rename = require("gulp-rename");

const env = "dev";
const dest = "src/css";
const src = "src/css/tailwind.css";

const plugins = [
  require("tailwindcss"),
  require("autoprefixer"),
  ...(env === "production"
    ? [
        require("@fullhuman/postcss-purgecss")({
          content: ["./src/**/*.html", "./src/**/*.tsx"],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        })
      ]
    : [])
];

gulp.task("watch", function() {
  gulp.watch("src/*.css", gulp.series("css"));
  gulp.watch("tailwind.config.js", gulp.series("css"));
  gulp.watch("postcss.config.js", gulp.series("css"));
  gulp.watch("src/*.html", browserSync.reload);
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./src"
    },
    browser: ["google chrome", "chrome", "google-chrome", "chromium-browser"]
  });

  gulp.watch("tailwind.config.js", gulp.series("css"));
  gulp.watch("src/tailwind.css", gulp.series("css"));
  gulp.watch("postcss.config.js", gulp.series("css"));
  gulp.watch("src/css/*.css").on("change", browserSync.reload);
  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("css", function() {
  const postcss = require("gulp-postcss");

  return gulp
    .src("src/css/main.tailwind.css")
    .pipe(postcss(plugins))
    .pipe(rename("tailwind.css"))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
});

gulp.task("brotli", function() {
  const brotli = require("gulp-brotli");

  return gulp
    .src(src)
    .pipe(brotli.compress())
    .pipe(gulp.dest(dest));
});

gulp.task("minify", function() {
  const cleanCss = require("gulp-clean-css");
  const sourcemaps = require("gulp-sourcemaps");

  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(cleanCss())
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(dest));
});

gulp.task("prod", gulp.series("css", "minify", "brotli"));

gulp.task("default", gulp.series("css", "browser-sync", "watch"));
