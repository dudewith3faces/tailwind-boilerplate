const browserSync = require('browser-sync').create();
const gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch('src/tailwind.css', ['css'], browserSync.reload);
  gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './src',
    },
  });

  gulp.watch('src/css/*.css').on('change', browserSync.reload);
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('css', function() {
  const postcss = require('gulp-postcss');

  return gulp
    .src('src/tailwind.css')
    .pipe(postcss([require('tailwindcss'), require('autoprefixer')]))
    .pipe(gulp.dest('src/css'));
});

gulp.task('default', gulp.series('css', 'browser-sync', 'watch'));
