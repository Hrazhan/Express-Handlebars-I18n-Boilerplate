const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const rtlcss = require('gulp-rtlcss');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('copy',() => {
    gulp.src('./public/stylesheets/style.sass')
    .pipe(gulp.dest('./public'))
})

gulp.task('rtl', function () {
    return gulp.src(['./public/stylesheets/*.css'])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(["last 2 versions", "> 1%"])) // Other post-processing.
        .pipe(gulp.dest('./public/stylesheets')) // Output LTR stylesheets.
        .pipe(rtlcss()) // Convert to RTL.
        .pipe(rename({ suffix: '.rtl' })) // Append ".rtl" to the filename.
        .pipe(sourcemaps.write('./')) // Output source maps.
        .pipe(gulp.dest('./public/stylesheets')); // Output RTL stylesheets.
});