const browserSync = require('browser-sync').create();
const gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch('src/*.css', gulp.series('css'));
  gulp.watch('tailwind.config.js', gulp.series('css'));
  gulp.watch('postcss.config.js', gulp.series('css'));
  gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './src',
    },
  });

  gulp.watch('tailwind.config.js', gulp.series('css'));
  gulp.watch('src/tailwind.css', gulp.series('css'));
  gulp.watch('postcss.config.js', gulp.series('css'));
  gulp.watch('src/css/*.css').on('change', browserSync.reload);
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('css', function() {
  const postcss = require('gulp-postcss');

  return gulp
    .src('src/tailwind.css')
    .pipe(postcss([require('tailwindcss'), require('autoprefixer')]))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('default', gulp.series('css', 'browser-sync', 'watch'));
